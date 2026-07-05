const pool = require('../config/db');
const { success, fail } = require('../utils/response');
const NombaService = require('../services/NombaService');
const { updateScore } = require('../services/ScoreService');

function generatePaymentCode() {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let code = 'esc_';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function createEscrow(req, res, next) {
  try {
    const { amount, description, recipient_email, recipient_phone } = req.body;

    if (!amount || !description) {
      return fail(res, 'Amount and description are required', 400);
    }

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    const paymentCode = generatePaymentCode();
    const orderReference = `${paymentCode}-${Date.now()}`;

    const checkout = await NombaService.createCheckoutOrder({
      amount: parseFloat(amount),
      customerEmail: recipient_email || user.email,
      orderReference,
      customerId: String(req.user.id),
      narration: `Escrow: ${description}`,
    });

    let recipientUserId = null;
    if (recipient_email) {
      const recipientResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [recipient_email]
      );
      if (recipientResult.rows.length > 0) {
        recipientUserId = recipientResult.rows[0].id;
      }
    }

    const result = await pool.query(
      `INSERT INTO escrows
         (creator_user_id, recipient_user_id, amount, description,
          payment_code, nomba_checkout_link, nomba_reference, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'awaiting_payment')
       RETURNING *`,
      [
        req.user.id, recipientUserId, amount, description,
        paymentCode, checkout.checkoutLink, orderReference,
      ]
    );

    return success(res, {
  escrow: result.rows[0],
  escrow_id: result.rows[0].id,
  checkout_link: checkout.checkoutLink,
  payment_link: `${process.env.FRONTEND_URL}/pay/${paymentCode}`,
  share_message: `You have been requested to pay ₦${amount} for "${description}". Pay securely here: ${process.env.FRONTEND_URL}/pay/${paymentCode}`,
}, 'Escrow created successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function getMyEscrows(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT e.*,
         creator.full_name as creator_name,
         recipient.full_name as recipient_name
       FROM escrows e
       LEFT JOIN users creator ON creator.id = e.creator_user_id
       LEFT JOIN users recipient ON recipient.id = e.recipient_user_id
       WHERE e.creator_user_id = $1 OR e.recipient_user_id = $1
       ORDER BY e.created_at DESC`,
      [req.user.id]
    );

    return success(res, result.rows, 'Escrows fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getEscrowById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT e.*,
         creator.full_name as creator_name,
         recipient.full_name as recipient_name
       FROM escrows e
       LEFT JOIN users creator ON creator.id = e.creator_user_id
       LEFT JOIN users recipient ON recipient.id = e.recipient_user_id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return fail(res, 'Escrow not found', 404);
    }

    return success(res, result.rows[0], 'Escrow fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getPublicEscrow(req, res, next) {
  try {
    const { code } = req.params;

    const result = await pool.query(
      `SELECT e.amount, e.description, e.status, e.nomba_checkout_link,
         creator.full_name as creator_name
       FROM escrows e
       LEFT JOIN users creator ON creator.id = e.creator_user_id
       WHERE e.payment_code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      return fail(res, 'Escrow not found', 404);
    }

    return success(res, result.rows[0], 'Escrow fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function confirmEscrow(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM escrows WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return fail(res, 'Escrow not found', 404);
    }

    const escrow = result.rows[0];

    if (escrow.status === 'released') {
      return fail(res, 'Escrow has already been released', 400);
    }

    if (escrow.status !== 'funded' && escrow.status !== 'awaiting_confirmation') {
      return fail(res, 'Escrow is not yet funded', 400);
    }

    const isCreator = escrow.creator_user_id === req.user.id;
    const isRecipient = escrow.recipient_user_id === req.user.id;

    if (!isCreator && !isRecipient) {
      return fail(res, 'You are not a party to this escrow', 403);
    }

    const updateField = isCreator ? 'creator_confirmed' : 'recipient_confirmed';

    await pool.query(
      `UPDATE escrows SET ${updateField} = TRUE, status = 'awaiting_confirmation' WHERE id = $1`,
      [id]
    );

    const updatedResult = await pool.query('SELECT * FROM escrows WHERE id = $1', [id]);
    const updated = updatedResult.rows[0];

    if (updated.creator_confirmed && updated.recipient_confirmed) {
      // Both confirmed — release funds
      // In production: call NombaService.transferToBank() to the recipient's bank account
      // For now we update status and flag for manual/webhook release
      await pool.query(
        `UPDATE escrows SET status = 'released', released_at = NOW() WHERE id = $1`,
        [id]
      );

      // Score both parties
      await updateScore(escrow.creator_user_id, 1, 'Escrow completed successfully', 'escrow_complete');
      if (escrow.recipient_user_id) {
        await updateScore(escrow.recipient_user_id, 1, 'Escrow completed successfully', 'escrow_complete');
      }

      return success(res, { status: 'released' }, 'Both parties confirmed. Funds released.');
    }

    return success(res, {
      status: 'awaiting_confirmation',
      your_confirmation: true,
      waiting_for: isCreator ? 'recipient' : 'creator',
    }, 'Your confirmation recorded. Waiting for the other party.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createEscrow,
  getMyEscrows,
  getEscrowById,
  getPublicEscrow,
  confirmEscrow,
};