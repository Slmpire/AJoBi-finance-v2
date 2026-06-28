const jwt = require('jsonwebtoken');
const { fail } = require('../utils/response');

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 'No token provided', 401);
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return fail(res, 'Invalid or expired token', 401);
  }
}

module.exports = auth;