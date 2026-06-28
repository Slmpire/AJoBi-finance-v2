const { fail } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return fail(res, message, statusCode);
}

module.exports = errorHandler;