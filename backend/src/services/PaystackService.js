const axios = require('axios');

let cachedBanks = null;

const client = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

async function request(method, path, data = null) {
  try {
    const response = await client({ method, url: path, data });
    return response.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    const error = new Error(`Paystack error: ${message}`);
    error.statusCode = err.response?.status || 500;
    error.paystackResponse = err.response?.data;
    throw error;
  }
}

// ============================
// CHECKOUT (Initialize Transaction)
// ============================

async function createCheckoutOrder({
  amount,        // in Naira — we convert to kobo
  customerEmail,
  orderReference,
  narration,
  callbackUrl,
}) {
  const res = await request('POST', '/transaction/initialize', {
    email: customerEmail,
    amount: Math.round(amount * 100), // kobo
    reference: orderReference,
    callback_url: callbackUrl || process.env.PAYSTACK_CALLBACK_URL,
    metadata: {
      narration: narration || 'AjoBI Payment',
      internal_ref: orderReference,
    },
  });

  // Match Nomba's return shape so controllers need minimal changes
  return {
    checkoutLink: res.data.authorization_url,
    orderReference: res.data.reference,
  };
}

async function verifyCheckoutOrder(reference) {
  const res = await request('GET', `/transaction/verify/${reference}`);
  return res.data;
}

// ============================
// TRANSFERS (disbursements)
// ============================

async function getBankCodes() {
  if (cachedBanks) return cachedBanks;
  const res = await request('GET', '/bank?currency=NGN&perPage=200');
  cachedBanks = res.data.map(b => ({
    name: b.name,
    code: b.code,
    slug: b.slug,
  }));
  return cachedBanks;
}

async function lookupBankAccount(accountNumber, bankCode) {
  const res = await request(
    'GET',
    `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
  );
  return {
    accountNumber: res.data.account_number,
    accountName: res.data.account_name,
  };
}

async function createTransferRecipient({ accountName, accountNumber, bankCode }) {
  const res = await request('POST', '/transferrecipient', {
    type: 'nuban',
    name: accountName,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: 'NGN',
  });
  return res.data.recipient_code;
}

async function transferToBank({
  amount,
  accountNumber,
  accountName,
  bankCode,
  merchantTxRef,
  narration,
}) {
  // Paystack requires a recipient code — create one first
  const recipientCode = await createTransferRecipient({
    accountName,
    accountNumber,
    bankCode,
  });

  const res = await request('POST', '/transfer', {
    source: 'balance',
    amount: Math.round(amount * 100), // kobo
    recipient: recipientCode,
    reference: merchantTxRef,
    reason: narration || 'AjoBI Payout',
  });

  return res.data;
}

// ============================
// DEDICATED VIRTUAL ACCOUNTS
// ============================

async function createOrGetCustomer({ email, firstName, lastName, phone }) {
  // Check if customer exists
  try {
    const existing = await request('GET', `/customer/${email}`);
    if (existing.data?.customer_code) return existing.data.customer_code;
  } catch (_) {}

  const res = await request('POST', '/customer', {
    email,
    first_name: firstName,
    last_name: lastName,
    phone,
  });
  return res.data.customer_code;
}

async function createVirtualAccount({ accountRef, accountName, email, phone }) {
  // accountRef = user ID, accountName = full name
  const [firstName, ...rest] = (accountName || 'AjoBI User').split(' ');
  const lastName = rest.join(' ') || 'User';

  const customerCode = await createOrGetCustomer({
    email,
    firstName,
    lastName,
    phone: phone || '+2340000000000',
  });

  const res = await request('POST', '/dedicated_account', {
    customer: customerCode,
    preferred_bank: 'wema-bank', // free DVA on Paystack sandbox
  });

  return {
    accountNumber: res.data.account_number,
    accountName: res.data.account_name,
    bankName: res.data.bank?.name || 'Wema Bank',
    accountRef,
  };
}

async function getVirtualAccount(accountRef) {
  // accountRef is the user's email on Paystack
  const res = await request('GET', `/dedicated_account?customer=${accountRef}`);
  const account = res.data?.[0];
  if (!account) throw new Error('Virtual account not found');
  return {
    accountNumber: account.account_number,
    accountName: account.account_name,
    bankName: account.bank?.name,
  };
}

module.exports = {
  request,
  createCheckoutOrder,
  verifyCheckoutOrder,
  getBankCodes,
  lookupBankAccount,
  transferToBank,
  createVirtualAccount,
  getVirtualAccount,
};
