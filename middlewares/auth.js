const SECRET_JWT = require('../constants');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  //const token = req.cookies.jwt;
  let payload;

  /*try {
    payload = jwt.verify(token, SECRET_JWT);
    console.log(payload._id);
    User.findOne({_id: payload._id}).select('+password')
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(403).send({ message: 'нет такого пользователя'});
      }

      req.user = payload;
      next();
    });
  } catch (err) {
      return res.status(401).send({ message: 'При аутентификации произошла ошибка'});
    }*/
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      return res
        .status(401)
        .send({ message: 'Необходима авторизация' });
    }

    req.user = payload;

    next();
};

module.exports = auth;
