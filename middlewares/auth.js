const jwt = require('jsonwebtoken');
const Error401 = require('../errors/Error401');
const { errorMessage } = require('../constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Error401(errorMessage.errorAuth));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new Error401(errorMessage.errorAuth));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
