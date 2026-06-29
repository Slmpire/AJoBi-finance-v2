const axios = require('axios');

let cachedToken = null;
let tokenExpiresAt = null;

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

  const { access_token, expiresAt } = response.data;

  cachedToken = access_token;
  // Refresh 2 minutes early to avoid edge-of-expiry failures
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

module.exports = { getAccessToken, request };