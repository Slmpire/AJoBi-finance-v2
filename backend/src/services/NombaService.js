const axios = require('axios');

let cachedToken = null;
let tokenExpiresAt = null;
let cachedBanks = null;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await axios.post(
    `${process.env.NOMBA_BASE_URL}/v1/auth/token/issue`,
    {
      grant_type: 'client_credentials',
      client_id: process.env.NOMBA_CLIENT_ID,
      client_secret: process.env.NOMBA_CLIENT_SECRET,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        accountId: process.env.NOMBA_PARENT_ACCOUNT_ID,
      },
    }
  );

  const { access_token, expiresAt } = response.data.data;

  cachedToken = access_token;
  tokenExpiresAt = new Date(expiresAt).getTime() - (2 * 60 * 1000);

  return cachedToken;
}

async function request(method, path, data = null) {
  const token = await getAccessToken();

  try {
    const response = await axios({
      method,
      url: `${process.env.NOMBA_BASE_URL}${path}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        accountId: process.env.NOMBA_PARENT_ACCOUNT_ID,
      },
    });

    return response.data;
  } catch (err) {
    const message = err.response?.data?.description || err.message;
    const error = new Error(`Nomba API error: ${message}`);
    error.statusCode = err.response?.status || 500;
    error.nombaResponse = err.response?.data;
    throw error;
  }
}

// ============================
// DIRECT DEBIT MANDATES
// ============================

/**
 * Creates a fixed-amount, fixed-frequency Direct Debit mandate.
 * Nomba auto-debits on this schedule once the customer authenticates
 * the mandate via the N50 token payment (NIBSS e-mandate flow).
 */
async function createDirectDebitMandate({
  customerAccountNumber,
  bankCode,
  customerName,
  customerAddress,
  customerAccountName,
  amount,
  frequency, // DAILY, WEEKLY, MONTHLY etc — confirm exact enum values with Nomba support
  narration,
  customerPhoneNumber,
  customerEmail,
  merchantReference,
  startDate, // ISO format, e.g. 2026-07-05T09:00
  endDate,
  startImmediately = true,
}) {
  const data = await request('POST', '/v1/direct-debits', {
    customerAccountNumber,
    bankCode,
    customerName,
    customerAddress,
    customerAccountName,
    amount,
    frequency,
    narration,
    customerPhoneNumber,
    merchantReference,
    startDate,
    endDate,
    customerEmail,
    startImmediately,
  });

  return data.data; // { mandateId, merchantReference, phoneNumber, description }
}

// ============================
// TRANSFERS (disbursements)
// ============================

async function getBankCodes() {
  if (cachedBanks) return cachedBanks;

  const data = await request('GET', '/v1/transfers/banks');
  cachedBanks = data.data.results;
  return cachedBanks;
}

async function lookupBankAccount(accountNumber, bankCode) {
  const data = await request('POST', '/v1/transfers/bank/lookup', {
    accountNumber,
    bankCode,
  });

  return data.data; // { accountNumber, accountName }
}

async function transferToBank({
  amount,
  accountNumber,
  accountName,
  bankCode,
  merchantTxRef,
  senderName = 'AjoBI',
  narration,
}) {
  const data = await request('POST', '/v2/transfers/bank', {
    amount,
    accountNumber,
    accountName,
    bankCode,
    merchantTxRef,
    senderName,
    narration,
  });

  return data.data;
}

module.exports = {
  getAccessToken,
  request,
  createDirectDebitMandate,
  getBankCodes,
  lookupBankAccount,
  transferToBank,
};