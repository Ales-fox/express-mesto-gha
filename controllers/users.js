const User = require('../models/user'); // Модуль для хеширования пароля
const jwt = require('jsonwebtoken'); // Модуль для создания токенов
const {errorMessage, SECRET_JWT} = require('../constants');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const Error400 = require('../errors/Error400');
const EmailExistError = require('../errors/EmailExistError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  console.log(req.params);
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
       return next(new NotFoundError(errorMessage.notFoundUser));
      }
      if (err.name === 'CastError') {
        return next(new Error400(errorMessage.castError));
      }
    next(err);
    });
};

module.exports.getMyInfo = (req, res, next) => {
  User.findById(req.user._id).orFail(new Error('NotFound'))
    .then((myInfo) => res.send({ myInfo }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(errorMessage.notFoundUser));
      } else if (err.name === 'CastError') {
        next(new Error400(errorMessage.castError));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar  } = req.body;

  bcrypt.hash(password, 10) //Хэшируем пароль, 10 - длина "соли"
    .then(hash => User.create({ email, password: hash, name, about, avatar  }))
    .then((user) => {
      const { name, about, avatar, email } = user;
      res.status(200).send({ name, about, avatar, email })})
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400(errorMessage.validationError));
      }
      if (err.code === 11000) {
        return next(new EmailExistError(errorMessage.emailExistError));
      }
      next(err);
    });
};

module.exports.correctUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400(errorMessage.validationError));
      }
      if (err.message === 'NotFound') {
        return next(new NotFoundError(errorMessage.notFoundUser));
      }
      if (err.name === 'CastError') {
        return next(new Error400(errorMessage.castError));
      }
      next(err);
    });
};

module.exports.correctAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).orFail(new Error('NotFound'))
    .then((users) => res.send({ users }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(errorMessage.notFoundUser));
      } else if (err.name === 'CastError') {
        next(new Error400(errorMessage.castError));
      } else if (err.name === 'ValidationError') {
        next(new Error400(errorMessage.validationError));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      const token = jwt.sign({ _id: user._id }, SECRET_JWT, { expiresIn: '7d' }); // в течение 7 дней токен будет действителен

      res.status(200).send({ token });
    })
    .catch((err) => next(err));
};
