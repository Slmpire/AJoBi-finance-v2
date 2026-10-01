const crypto = require('crypto');
const pool = require('../config/db');
const { updateScore } = require('../services/ScoreService');
const PaystackService = require('../services/PaystackService');

function verifySignature(rawBody, signatureHeader) {
  if (!process.env.PAYSTACK_SECRET_KEY) return true;
  const computed = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, 'utf8'),
      Buffer.from(signatureHeader || '', 'utf8')
    );
  } catch {
    return false;
  }
}

async function handlePaystack(req, res) {
  const rawBody = req.body;
  const signature = req.headers['x-paystack-signature'] || '';

  console.log('[Webhook] Paystack event received');

  if (!verifySignature(rawBody, signature)) {
    console.warn('[Webhook] Signature verification failed');
    return res.status(401).json({ status: false, message: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ status: false, message: 'Invalid JSON' });
  }

  const event = payload.event;
  const data = payload.data || {};

  console.log('[Webhook] Event:', event, '| Reference:', data.reference);

  // Respond immediately
  res.status(200).json({ status: true, message: 'Webhook received' });

  try {
    if (event === 'charge.success') {
      await handleChargeSuccess(data.reference, data);
    } else if (event === 'transfer.success') {
      await handleTransferSuccess(data.reference, data);
    } else if (event === 'transfer.failed' || event === 'transfer.reversed') {
      await handleTransferFailed(data.reference, data);
    } else {
      console.log('[Webhook] Unhandled event:', event);
    }
  } catch (err) {
    console.error('[Webhook] Processing error:', err.message);
  }
}

async function handleChargeSuccess(reference, data) {
  if (!reference) return;

  if (reference.startsWith('GRP-')) {
    await handleGroupPayment(reference, data);
  } else if (reference.startsWith('SAV-')) {
    await handleSavingsPayment(reference, data);
  } else if (reference.startsWith('esc_')) {
    await handleEscrowPayment(reference, data);
  } else {
    console.log('[Webhook] Unknown reference prefix:', reference);
  }
}

async function handleGroupPayment(reference, data) {
  const paymentResult = await pool.query(
    `UPDATE group_payments
     SET status = 'paid', paid_at = NOW()
     WHERE nomba_reference = $1
     RETURNING *`,
    [reference]
  );

  if (paymentResult.rows.length === 0) {
    console.warn('[Webhook] Group payment not found:', reference);
    return;
  }

  const payment = paymentResult.rows[0];
  await updateScore(payment.user_id, 2, 'Paid Ajo group contribution on time', 'group_payment');

  const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1', [payment.group_id]);
  const group = groupResult.rows[0];

  const memberCount = await pool.query(
    'SELECT COUNT(*) FROM group_members WHERE group_id = $1',
    [payment.group_id]
  );

  const paidCount = await pool.query(
    `SELECT COUNT(*) FROM group_payments
     WHERE group_id = $1 AND cycle_number = $2 AND status = 'paid'`,
    [payment.group_id, payment.cycle_number]
  );

  const totalMembers = parseInt(memberCount.rows[0].count, 10);
  const totalPaid = parseInt(paidCount.rows[0].count, 10);

  console.log(`[Webhook] Group ${payment.group_id} cycle ${payment.cycle_number}: ${totalPaid}/${totalMembers} paid`);

  if (totalPaid >= totalMembers) {
    await disburseToPotRecipient(group, payment.cycle_number);
  }
}

async function disburseToPotRecipient(group, cycleNumber) {
  const memberResult = await pool.query(
    `SELECT gm.*, u.full_name, u.bank_account, u.bank_code, u.account_name
     FROM group_members gm
     JOIN users u ON u.id = gm.user_id
     WHERE gm.group_id = $1 AND gm.rotation_position = $2`,
    [group.id, ((cycleNumber - 1) % group.max_members) + 1]
  );

  if (memberResult.rows.length === 0) {
    console.warn('[Webhook] No recipient found for group', group.id, 'cycle', cycleNumber);
    return;
  }

  const recipient = memberResult.rows[0];
  const totalPot = parseFloat(group.contribution_amount) * parseInt(group.max_members, 10);
  const transferRef = `PAYOUT-GRP-${group.id}-CYC-${cycleNumber}-${Date.now()}`;

  await pool.query(
    `INSERT INTO group_disbursements
       (group_id, recipient_user_id, cycle_number, amount, status, nomba_transfer_id)
     VALUES ($1, $2, $3, $4, 'processing', $5)`,
    [group.id, recipient.user_id, cycleNumber, totalPot, transferRef]
  );

  console.log(`[Webhook] Disbursing ₦${totalPot} to ${recipient.full_name}`);

  const hasBank = recipient.bank_account && recipient.bank_code && recipient.account_name;

  if (hasBank) {
    try {
      await PaystackService.transferToBank({
        amount: totalPot,
        accountNumber: recipient.bank_account,
        accountName: recipient.account_name,
        bankCode: recipient.bank_code,
        merchantTxRef: transferRef,
        narration: `AjoBI - ${group.name} cycle ${cycleNumber} payout`,
      });

      await pool.query(
        `UPDATE group_disbursements SET status = 'completed', disbursed_at = NOW()
         WHERE nomba_transfer_id = $1`,
        [transferRef]
      );

      // Score boost for receiving payout
      await updateScore(recipient.user_id, 3, 'Received Ajo group payout', 'group_payout');
      console.log('[Webhook] Transfer successful to', recipient.full_name);
    } catch (err) {
      console.error('[Webhook] Transfer failed:', err.message);
      await pool.query(
        `UPDATE group_disbursements SET status = 'failed' WHERE nomba_transfer_id = $1`,
        [transferRef]
      );
    }
  } else {
    // For demo — mark as completed anyway and log it
    await pool.query(
      `UPDATE group_disbursements SET status = 'pending_bank_details', disbursed_at = NOW()
       WHERE nomba_transfer_id = $1`,
      [transferRef]
    );
    await updateScore(recipient.user_id, 3, 'Received Ajo group payout', 'group_payout');
    console.warn('[Webhook] No bank details — marked pending. User:', recipient.user_id);
  }

  // Advance cycle
  await pool.query(
    `UPDATE groups
     SET current_cycle = current_cycle + 1,
         next_collection_date = CASE frequency
           WHEN 'weekly' THEN next_collection_date + INTERVAL '7 days'
           WHEN 'biweekly' THEN next_collection_date + INTERVAL '14 days'
           WHEN 'monthly' THEN next_collection_date + INTERVAL '1 month'
         END
     WHERE id = $1`,
    [group.id]
  );

  console.log(`[Webhook] Group ${group.id} advanced to cycle ${parseInt(group.current_cycle, 10) + 1}`);
}

async function handleSavingsPayment(reference, data) {
  const result = await pool.query(
    `UPDATE savings_instalments SET status = 'paid', paid_at = NOW()
     WHERE nomba_reference = $1 RETURNING *`,
    [reference]
  );

  if (result.rows.length === 0) return;
  const instalment = result.rows[0];

  await pool.query(
    `UPDATE savings_goals SET locked_balance = locked_balance + $1 WHERE id = $2`,
    [instalment.amount, instalment.goal_id]
  );

  const goal = (await pool.query('SELECT * FROM savings_goals WHERE id = $1', [instalment.goal_id])).rows[0];

  if (parseFloat(goal.locked_balance) >= parseFloat(goal.target_amount)) {
    await pool.query(`UPDATE savings_goals SET status = 'completed' WHERE id = $1`, [goal.id]);
    await updateScore(instalment.user_id, 5, 'Completed a savings goal', 'savings_complete');
  } else {
    const nextDate = new Date();
    if (goal.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else nextDate.setMonth(nextDate.getMonth() + 1);
    await pool.query(`UPDATE savings_goals SET next_debit_date = $1 WHERE id = $2`, [nextDate, goal.id]);
    await updateScore(instalment.user_id, 1, 'Made a savings instalment', 'savings_instalment');
  }
}

async function handleEscrowPayment(reference, data) {
  await pool.query(
    `UPDATE escrows SET status = 'funded' WHERE nomba_reference = $1`,
    [reference]
  );
  console.log('[Webhook] Escrow funded:', reference);
}

async function handleTransferSuccess(reference, data) {
  console.log('[Webhook] Transfer confirmed:', reference);
  await pool.query(
    `UPDATE group_disbursements SET status = 'completed', disbursed_at = NOW()
     WHERE nomba_transfer_id = $1`,
    [reference]
  );
}

async function handleTransferFailed(reference, data) {
  console.log('[Webhook] Transfer failed:', reference);
  await pool.query(
    `UPDATE group_disbursements SET status = 'failed' WHERE nomba_transfer_id = $1`,
    [reference]
  );
}

module.exports = { handlePaystack };
