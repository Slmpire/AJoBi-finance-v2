const pool = require('../config/db');
const { success, fail } = require('../utils/response');
const NombaService = require('../services/NombaService');
const { updateScore } = require('../services/ScoreService');
const bcrypt = require('bcrypt');

function generatePaymentCode() {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let code = 'esc_';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function generatePIN() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// CREATE ESCROW
async function createEscrow(req, res, next) {
  try {
    const { amount, description, recipient_email, recipient_phone } = req.body;

    if (!amount || !description) {
      return fail(res, 'Amount and description are required', 400);
    }

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    const paymentCode = generatePaymentCode();
    const pin = generatePIN();
    const orderReference = `${paymentCode}-${Date.now()}`;

    // Create real Nomba virtual account for this escrow
    let virtualAccountData = null;
    try {
      const accountRef = `ESC-${paymentCode}-${Date.now()}`;
      virtualAccountData = await NombaService.createVirtualAccount({
        accountRef,
        accountName: `AjoBI Escrow - ${description.substring(0, 20)}`,
        bvn: user.bvn || '00000000000',
        currency: 'NGN',
      });
    } catch (vaErr) {
      console.error('Virtual account creation failed:', vaErr.message);
    }

    // Also create Nomba checkout link as backup payment method
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

    // Store virtual account in DB
    let vaAccountNumber = null;
    let vaAccountName = null;
    let vaBankName = null;
    if (virtualAccountData) {
      vaAccountNumber = virtualAccountData.bankAccountNumber || virtualAccountData.accountNumber;
      vaAccountName = virtualAccountData.accountName;
      vaBankName = virtualAccountData.bankName || 'Nomba MFB';
    }

    const result = await pool.query(
      `INSERT INTO escrows
         (creator_user_id, recipient_user_id, amount, description,
          payment_code, nomba_checkout_link, nomba_reference,
          pin, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'awaiting_payment')
       RETURNING *`,
      [
        req.user.id, recipientUserId, amount, description,
        paymentCode, checkout.checkoutLink, orderReference, pin,
      ]
    );

    const escrow = result.rows[0];

    return success(res, {
      escrow,
      checkout_link: checkout.checkoutLink,
      payment_link: `${process.env.FRONTEND_URL}/pay/${paymentCode}`,
      virtual_account: virtualAccountData ? {
        account_number: vaAccountNumber,
        account_name: vaAccountName,
        bank_name: vaBankName,
        note: 'Transfer exact amount to this account. Payment will be confirmed automatically.',
      } : null,
      pin,
      pin_note: 'Share this PIN privately with the payer. They need it to confirm payment on the pay page.',
      share_message: `You have been requested to pay ₦${amount} for "${description}". Pay here: ${process.env.FRONTEND_URL}/pay/${paymentCode} — You will need the PIN which will be shared with you separately.`,
    }, 'Escrow created successfully', 201);
  } catch (err) {
    next(err);
  }
}

// GET MY ESCROWS
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

// GET ESCROW BY ID
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
    if (result.rows.length === 0) return fail(res, 'Escrow not found', 404);

    // Never expose pin or password hash to frontend
    const escrow = result.rows[0];
    delete escrow.pin;
    delete escrow.receiver_password_hash;

    return success(res, escrow, 'Escrow fetched successfully');
  } catch (err) {
    next(err);
  }
}

// GET PUBLIC ESCROW (no auth - for pay page)
async function getPublicEscrow(req, res, next) {
  try {
    const { code } = req.params;
    const result = await pool.query(
      `SELECT e.amount, e.description, e.status,
         e.nomba_checkout_link, e.payer_verified, e.receiver_verified,
         e.receiver_password_set,
         creator.full_name as creator_name
       FROM escrows e
       LEFT JOIN users creator ON creator.id = e.creator_user_id
       WHERE e.payment_code = $1`,
      [code]
    );
    if (result.rows.length === 0) return fail(res, 'Escrow not found', 404);
    return success(res, result.rows[0], 'Escrow fetched successfully');
  } catch (err) {
    next(err);
  }
}

// VERIFY PIN (payer enters PIN to unlock confirmation)
async function verifyPin(req, res, next) {
  try {
    const { code } = req.params;
    const { pin } = req.body;

    if (!pin) return fail(res, 'PIN is required', 400);

    const result = await pool.query(
      'SELECT * FROM escrows WHERE payment_code = $1',
      [code]
    );

    if (result.rows.length === 0) return fail(res, 'Escrow not found', 404);

    const escrow = result.rows[0];

    if (escrow.pin !== pin) {
      return fail(res, 'Invalid PIN. Please check with the person who shared this link.', 401);
    }

    return success(res, {
      verified: true,
      escrow_id: escrow.id,
      amount: escrow.amount,
      description: escrow.description,
      checkout_link: escrow.nomba_checkout_link,
    }, 'PIN verified successfully');
  } catch (err) {
    next(err);
  }
}

// SET RECEIVER PASSWORD (receiver sets their own password to confirm delivery)
async function setReceiverPassword(req, res, next) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 4) {
      return fail(res, 'Password must be at least 4 characters', 400);
    }

    const result = await pool.query('SELECT * FROM escrows WHERE id = $1', [id]);
    if (result.rows.length === 0) return fail(res, 'Escrow not found', 404);

    const escrow = result.rows[0];

    if (escrow.creator_user_id !== req.user.id && escrow.recipient_user_id !== req.user.id) {
      return fail(res, 'You are not a party to this escrow', 403);
    }

    if (escrow.receiver_password_set) {
      return fail(res, 'Receiver password has already been set', 400);
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE escrows SET receiver_password_hash = $1, receiver_password_set = TRUE WHERE id = $2`,
      [hash, id]
    );

    return success(res, {
      message: 'Password set. Share this password with the payer so they know delivery is confirmed.',
    }, 'Receiver password set successfully');
  } catch (err) {
    next(err);
  }
}

// CONFIRM ESCROW (dual confirmation with passwords)
async function confirmEscrow(req, res, next) {
  try {
    const { id } = req.params;
    const { receiver_password } = req.body;

    const result = await pool.query('SELECT * FROM escrows WHERE id = $1', [id]);
    if (result.rows.length === 0) return fail(res, 'Escrow not found', 404);

    const escrow = result.rows[0];

    if (escrow.status === 'released') {
      return fail(res, 'Escrow has already been released', 400);
    }

    if (escrow.status !== 'funded' && escrow.status !== 'awaiting_confirmation') {
      return fail(res, 'Escrow is not yet funded. Payment must be received first.', 400);
    }

    const isCreator = escrow.creator_user_id === req.user.id;
    const isRecipient = escrow.recipient_user_id === req.user.id;

    if (!isCreator && !isRecipient) {
      return fail(res, 'You are not a party to this escrow', 403);
    }

    // If receiver password is set, validate it before releasing
    if (escrow.receiver_password_set && receiver_password) {
      const valid = await bcrypt.compare(receiver_password, escrow.receiver_password_hash);
      if (!valid) {
        return fail(res, 'Incorrect receiver password. The receiver has not confirmed delivery yet.', 401);
      }
      await pool.query(
        'UPDATE escrows SET receiver_verified = TRUE WHERE id = $1', [id]
      );
    }

    // Mark this party as confirmed
    const updateField = isCreator ? 'creator_confirmed' : 'recipient_confirmed';
    await pool.query(
      `UPDATE escrows SET ${updateField} = TRUE, status = 'awaiting_confirmation' WHERE id = $1`,
      [id]
    );

    const updatedResult = await pool.query('SELECT * FROM escrows WHERE id = $1', [id]);
    const updated = updatedResult.rows[0];

    // Release only if:
    // 1. Both parties confirmed, AND
    // 2. If receiver password was set, it must have been verified
    const passwordOk = !updated.receiver_password_set || updated.receiver_verified;
    const bothConfirmed = updated.creator_confirmed && updated.recipient_confirmed;

    if (bothConfirmed && passwordOk) {
      await pool.query(
        `UPDATE escrows SET status = 'released', released_at = NOW() WHERE id = $1`,
        [id]
      );

      await updateScore(escrow.creator_user_id, 1, 'Escrow completed successfully', 'escrow_complete');
      if (escrow.recipient_user_id) {
        await updateScore(escrow.recipient_user_id, 1, 'Escrow completed successfully', 'escrow_complete');
      }

      return success(res, { status: 'released' }, 'Both parties confirmed. Funds released.');
    }

    if (bothConfirmed && !passwordOk) {
      return success(res, {
        status: 'awaiting_receiver_confirmation',
        message: 'Waiting for receiver to confirm delivery with their password.',
      }, 'Your confirmation recorded. Waiting for receiver password verification.');
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

// MARK PAYER VERIFIED (from public pay page after PIN verified)
async function markPayerVerified(req, res, next) {
  try {
    const { code } = req.params;

    await pool.query(
      `UPDATE escrows SET payer_verified = TRUE WHERE payment_code = $1`,
      [code]
    );

    return success(res, null, 'Payment verification recorded');
  } catch (err) {
    next(err);
  }
}

// GENERATE VIRTUAL ACCOUNT FOR ESCROW
async function generateVirtualAccount(req, res, next) {
  try {
    const { id } = req.params;

    const escrowResult = await pool.query('SELECT * FROM escrows WHERE id = $1', [id]);
    if (escrowResult.rows.length === 0) return fail(res, 'Escrow not found', 404);

    const escrow = escrowResult.rows[0];
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    const accountRef = `ESC-${escrow.payment_code}-${Date.now()}`;

    const account = await NombaService.createVirtualAccount({
      accountRef,
      accountName: `AjoBI Escrow - ${escrow.description?.substring(0, 20) || 'Payment'}`,
      bvn: user.bvn || '00000000000',
      currency: 'NGN',
    });

    return success(res, {
      account_number: account.bankAccountNumber || account.accountNumber,
      account_name: account.accountName,
      bank_name: account.bankName || 'Nomba MFB',
      note: 'Transfer the exact amount to this account number from any Nigerian bank.',
    }, 'Virtual account generated');
  } catch (err) {
    next(err);
  }
}

// ADMIN
async function releaseEscrowAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE escrows SET status = 'released', released_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) return fail(res, 'Escrow not found', 404);
    return success(res, result.rows[0], 'Escrow released by admin');
  } catch (err) {
    next(err);
  }
}

async function refundEscrowAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE escrows SET status = 'refunded' WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) return fail(res, 'Escrow not found', 404);
    return success(res, result.rows[0], 'Escrow refunded by admin');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createEscrow,
  getMyEscrows,
  getEscrowById,
  getPublicEscrow,
  verifyPin,
  setReceiverPassword,
  confirmEscrow,
  markPayerVerified,
  generateVirtualAccount,
  releaseEscrowAdmin,
  refundEscrowAdmin,
};