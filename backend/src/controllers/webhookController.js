const crypto = require('crypto');
const pool = require('../config/db');
const { updateScore } = require('../services/ScoreService');
const NombaService = require('../services/NombaService');

function verifySignature(rawBody, signatureHeader) {
  if (!process.env.NOMBA_WEBHOOK_SECRET || !signatureHeader) return true;
  // Nomba signs the raw body with HMAC-SHA256 using your webhook secret
  const computed = crypto
    .createHmac('sha256', process.env.NOMBA_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, 'utf8'),
      Buffer.from(signatureHeader, 'utf8')
    );
  } catch {
    return false;
  }
}

async function handleNomba(req, res) {
  const rawBody = req.body; // raw Buffer from express.raw()
  const signature = req.headers['x-nomba-signature']
    || req.headers['x-signature']
    || req.headers['signature']
    || '';

  // Log all headers on first receipt so we can confirm the real header name
  console.log('[Webhook] Headers:', JSON.stringify(req.headers, null, 2));

  if (!verifySignature(rawBody, signature)) {
    console.warn('[Webhook] Signature verification failed');
    return res.status(401).json({ status: false, message: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch (err) {
    return res.status(400).json({ status: false, message: 'Invalid JSON payload' });
  }

  console.log('[Webhook] Event received:', payload.event_type || payload.eventType, payload.data?.orderReference);

  // Respond immediately — Nomba expects a fast 200
  res.status(200).json({ status: true, message: 'Webhook received' });

  // Process async so we don't hold up the response
  try {
    const eventType = payload.event_type || payload.eventType || '';
    const data = payload.data || {};
    const orderReference = data.orderReference || data.order_reference || '';

    if (eventType === 'checkout.order.completed' || eventType === 'CHECKOUT_ORDER_COMPLETED') {
      await handleCheckoutSuccess(orderReference, data);
    } else if (eventType === 'checkout.order.failed' || eventType === 'CHECKOUT_ORDER_FAILED') {
      await handleCheckoutFailed(orderReference, data);
    } else {
      console.log('[Webhook] Unhandled event type:', eventType);
    }
  } catch (err) {
    console.error('[Webhook] Processing error:', err.message);
  }
}

async function handleCheckoutSuccess(orderReference, data) {
  if (!orderReference) return;

  console.log('[Webhook] Processing successful payment:', orderReference);

  // Route based on orderReference prefix
  if (orderReference.startsWith('GRP-')) {
    await handleGroupPayment(orderReference, data);
  } else if (orderReference.startsWith('SAV-')) {
    await handleSavingsPayment(orderReference, data);
  } else if (orderReference.startsWith('esc_')) {
    await handleEscrowPayment(orderReference, data);
  } else {
    console.log('[Webhook] Unknown orderReference prefix:', orderReference);
  }
}

async function handleGroupPayment(orderReference, data) {
  // Mark the payment as paid
  const paymentResult = await pool.query(
    `UPDATE group_payments
     SET status = 'paid', paid_at = NOW()
     WHERE nomba_reference = $1
     RETURNING *`,
    [orderReference]
  );

  if (paymentResult.rows.length === 0) {
    console.warn('[Webhook] Group payment not found:', orderReference);
    return;
  }

  const payment = paymentResult.rows[0];

  // Update AjoScore for the member
  await updateScore(payment.user_id, 2, 'Paid Ajo group contribution on time', 'group_payment');

  // Check if all members have paid this cycle
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
  // Find who receives this cycle's payout based on rotation
  const memberResult = await pool.query(
    `SELECT gm.*, u.full_name FROM group_members gm
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

  // Record disbursement
  await pool.query(
    `INSERT INTO group_disbursements
       (group_id, recipient_user_id, cycle_number, amount, status, nomba_transfer_id)
     VALUES ($1, $2, $3, $4, 'processing', $5)`,
    [group.id, recipient.user_id, cycleNumber, totalPot, transferRef]
  );

  console.log(`[Webhook] All paid — disbursing ₦${totalPot} to ${recipient.full_name} for group ${group.id}`);

  // In production: call NombaService.transferToBank() here with recipient bank details
  // For now mark as pending_transfer until we have recipient bank account on file
  const hasBank = recipient.bank_account && recipient.bank_code && recipient.account_name;

  if (hasBank) {
    try {
      const transfer = await NombaService.transferToBank({
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

      console.log('[Webhook] Transfer successful:', transfer);
    } catch (err) {
      console.error('[Webhook] Transfer failed:', err.message);
      await pool.query(
        `UPDATE group_disbursements SET status = 'failed' WHERE nomba_transfer_id = $1`,
        [transferRef]
      );
    }
  } else {
    await pool.query(
      `UPDATE group_disbursements SET status = 'pending_bank_details' WHERE nomba_transfer_id = $1`,
      [transferRef]
    );
    console.warn('[Webhook] Recipient has no bank details on file:', recipient.user_id);
  }

  // Advance the cycle
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

async function handleSavingsPayment(orderReference, data) {
  const instalmentResult = await pool.query(
    `UPDATE savings_instalments
     SET status = 'paid', paid_at = NOW()
     WHERE nomba_reference = $1
     RETURNING *`,
    [orderReference]
  );

  if (instalmentResult.rows.length === 0) {
    console.warn('[Webhook] Savings instalment not found:', orderReference);
    return;
  }

  const instalment = instalmentResult.rows[0];

  // Add to locked balance
  await pool.query(
    `UPDATE savings_goals
     SET locked_balance = locked_balance + $1
     WHERE id = $2`,
    [instalment.amount, instalment.goal_id]
  );

  // Check if goal is complete
  const goalResult = await pool.query(
    'SELECT * FROM savings_goals WHERE id = $1',
    [instalment.goal_id]
  );

  const goal = goalResult.rows[0];

  if (parseFloat(goal.locked_balance) + parseFloat(instalment.amount) >= parseFloat(goal.target_amount)) {
    await pool.query(
      `UPDATE savings_goals SET status = 'completed' WHERE id = $1`,
      [goal.id]
    );
    await updateScore(instalment.user_id, 5, 'Completed a savings goal', 'savings_complete');
    console.log('[Webhook] Savings goal completed:', goal.id);
  } else {
    // Set next debit date
    const nextDate = new Date();
    if (goal.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else nextDate.setMonth(nextDate.getMonth() + 1);

    await pool.query(
      `UPDATE savings_goals SET next_debit_date = $1 WHERE id = $2`,
      [nextDate, goal.id]
    );

    await updateScore(instalment.user_id, 1, 'Made a savings instalment', 'savings_instalment');
    console.log('[Webhook] Savings instalment recorded, next debit:', nextDate);
  }
}

async function handleEscrowPayment(orderReference, data) {
  const escrowResult = await pool.query(
    `UPDATE escrows
     SET status = 'funded'
     WHERE nomba_reference = $1
     RETURNING *`,
    [orderReference]
  );

  if (escrowResult.rows.length === 0) {
    console.warn('[Webhook] Escrow not found:', orderReference);
    return;
  }

  console.log('[Webhook] Escrow funded:', escrowResult.rows[0].id);
}

async function handleCheckoutFailed(orderReference, data) {
  console.log('[Webhook] Payment failed:', orderReference);

  if (orderReference.startsWith('GRP-')) {
    await pool.query(
      `UPDATE group_payments SET status = 'failed' WHERE nomba_reference = $1`,
      [orderReference]
    );
    const payment = await pool.query(
      'SELECT user_id FROM group_payments WHERE nomba_reference = $1',
      [orderReference]
    );
    if (payment.rows.length > 0) {
      await updateScore(payment.rows[0].user_id, -5, 'Missed Ajo group contribution', 'group_missed');
    }
  } else if (orderReference.startsWith('SAV-')) {
    await pool.query(
      `UPDATE savings_instalments SET status = 'failed' WHERE nomba_reference = $1`,
      [orderReference]
    );
  }
}

module.exports = { handleNomba };