const pool = require('../config/db');
const { success, fail } = require('../utils/response');
const NombaService = require('../services/NombaService');
const { updateScore } = require('../services/ScoreService');

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function nextCollectionDate(frequency) {
  const date = new Date();
  if (frequency === 'weekly') date.setDate(date.getDate() + 7);
  else if (frequency === 'biweekly') date.setDate(date.getDate() + 14);
  else if (frequency === 'monthly') date.setMonth(date.getMonth() + 1);
  return date;
}

async function createGroup(req, res, next) {
  try {
    const { name, contribution_amount, frequency, max_members } = req.body;

    if (!name || !contribution_amount || !frequency || !max_members) {
      return fail(res, 'All fields are required', 400);
    }

    if (!['weekly', 'biweekly', 'monthly'].includes(frequency)) {
      return fail(res, 'Frequency must be weekly, biweekly, or monthly', 400);
    }

    const inviteCode = generateInviteCode();
    const collectionDate = nextCollectionDate(frequency);

    const groupResult = await pool.query(
      `INSERT INTO groups (name, invite_code, contribution_amount, frequency, max_members, next_collection_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, inviteCode, contribution_amount, frequency, max_members, collectionDate, req.user.id]
    );

    const group = groupResult.rows[0];

    await pool.query(
      `INSERT INTO group_members (group_id, user_id, rotation_position)
       VALUES ($1, $2, 1)`,
      [group.id, req.user.id]
    );

    return success(res, {
      group,
      invite_link: `${process.env.FRONTEND_URL}/groups/join/${inviteCode}`,
    }, 'Group created successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function joinGroup(req, res, next) {
  try {
    const { invite_code } = req.body;

    if (!invite_code) {
      return fail(res, 'Invite code is required', 400);
    }

    const groupResult = await pool.query(
      'SELECT * FROM groups WHERE invite_code = $1',
      [invite_code.toUpperCase()]
    );

    if (groupResult.rows.length === 0) {
      return fail(res, 'Invalid invite code', 404);
    }

    const group = groupResult.rows[0];

    if (group.status === 'completed') {
      return fail(res, 'This group has already completed its cycle', 400);
    }

    const memberCountResult = await pool.query(
      'SELECT COUNT(*) FROM group_members WHERE group_id = $1',
      [group.id]
    );

    const currentCount = parseInt(memberCountResult.rows[0].count, 10);

    if (currentCount >= group.max_members) {
      return fail(res, 'This group is already full', 400);
    }

    const existingMember = await pool.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [group.id, req.user.id]
    );

    if (existingMember.rows.length > 0) {
      return fail(res, 'You are already a member of this group', 409);
    }

    await pool.query(
      `INSERT INTO group_members (group_id, user_id, rotation_position)
       VALUES ($1, $2, $3)`,
      [group.id, req.user.id, currentCount + 1]
    );

    return success(res, group, 'Joined group successfully');
  } catch (err) {
    next(err);
  }
}

async function getMyGroups(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT g.*, gm.rotation_position, gm.mandate_status,
        (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
        (SELECT status FROM group_payments
          WHERE group_id = g.id AND user_id = $1 AND cycle_number = g.current_cycle
          LIMIT 1) as my_payment_status
       FROM groups g
       JOIN group_members gm ON gm.group_id = g.id
       WHERE gm.user_id = $1
       ORDER BY g.created_at DESC`,
      [req.user.id]
    );

    return success(res, result.rows, 'Groups fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getGroupById(req, res, next) {
  try {
    const { id } = req.params;

    const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);

    if (groupResult.rows.length === 0) {
      return fail(res, 'Group not found', 404);
    }

    const group = groupResult.rows[0];

    const membersResult = await pool.query(
      `SELECT gm.user_id, gm.rotation_position, gm.mandate_status, u.full_name,
        (SELECT status FROM group_payments
          WHERE group_id = gm.group_id AND user_id = gm.user_id AND cycle_number = $2
          LIMIT 1) as current_cycle_status
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       WHERE gm.group_id = $1
       ORDER BY gm.rotation_position ASC`,
      [id, group.current_cycle]
    );

    const nextRecipient = membersResult.rows.find(
      m => m.rotation_position === ((group.current_cycle - 1) % membersResult.rows.length) + 1
    );

    return success(res, {
      group,
      members: membersResult.rows,
      next_recipient: nextRecipient || null,
    }, 'Group fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getGroupMembers(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT gm.user_id, gm.rotation_position, gm.mandate_status, u.full_name
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       WHERE gm.group_id = $1
       ORDER BY gm.rotation_position ASC`,
      [id]
    );

    return success(res, result.rows, 'Members fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getGroupPayments(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT gp.*, u.full_name
       FROM group_payments gp
       JOIN users u ON u.id = gp.user_id
       WHERE gp.group_id = $1
       ORDER BY gp.cycle_number DESC, gp.paid_at DESC NULLS LAST`,
      [id]
    );

    return success(res, result.rows, 'Payments fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function setupDebit(req, res, next) {
  try {
    const { id } = req.params;
    const { account_number, bank_code } = req.body;

    if (!account_number || !bank_code) {
      return fail(res, 'Account number and bank code are required', 400);
    }

    const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);

    if (groupResult.rows.length === 0) {
      return fail(res, 'Group not found', 404);
    }

    const group = groupResult.rows[0];

    const memberResult = await pool.query(
      'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (memberResult.rows.length === 0) {
      return fail(res, 'You are not a member of this group', 403);
    }

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    // Verify the account before creating the mandate
    const lookup = await NombaService.lookupBankAccount(account_number, bank_code);

    const frequencyMap = { weekly: 'WEEKLY', biweekly: 'BIWEEKLY', monthly: 'MONTHLY' };
    const merchantReference = `GRP-${group.id}-USR-${req.user.id}-${Date.now()}`;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // mandate valid for a year, renewable later

    const mandate = await NombaService.createDirectDebitMandate({
      customerAccountNumber: account_number,
      bankCode: bank_code,
      customerName: user.full_name,
      customerAddress: 'Nigeria', // placeholder until we collect a real address field
      customerAccountName: lookup.accountName,
      amount: group.contribution_amount,
      frequency: frequencyMap[group.frequency],
      narration: `AjoBI - ${group.name}`,
      customerPhoneNumber: user.phone,
      customerEmail: user.email,
      merchantReference,
      startDate: startDate.toISOString().slice(0, 16),
      endDate: endDate.toISOString().slice(0, 16),
      startImmediately: true,
    });

    await pool.query(
      `UPDATE group_members
       SET nomba_mandate_id = $1, bank_account = $2, bank_code = $3,
           account_name = $4, mandate_status = 'awaiting_authentication'
       WHERE group_id = $5 AND user_id = $6`,
      [mandate.mandateId, account_number, bank_code, lookup.accountName, id, req.user.id]
    );

    return success(res, {
      mandate_id: mandate.mandateId,
      authentication_instructions: mandate.description,
    }, 'Direct debit mandate created. Complete authentication to activate.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createGroup,
  joinGroup,
  getMyGroups,
  getGroupById,
  getGroupMembers,
  getGroupPayments,
  setupDebit,
};