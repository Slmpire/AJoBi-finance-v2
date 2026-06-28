function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ status: true, message, data });
}

function fail(res, message = 'Something went wrong', statusCode = 400, data = null) {
  return res.status(statusCode).json({ status: false, message, data });
}

module.exports = { success, fail };