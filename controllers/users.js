const User = require('../models/user'); // Модуль для хеширования пароля
const jwt = require('jsonwebtoken'); // Модуль для создания токенов
const {errorMessage, SECRET_JWT} = require('../constants');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ValidError = require('../errors/ValidError');
const EmailExistError = require('../errors/EmailExistError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  console.log(req);
  User.findById(req.body._id).orFail(new NotFoundError(errorMessage.notFoundUser))
    .populate('name')
    .then((user) => {
      if (!user) {
        next(new NotFoundError(errorMessage.notFoundUser));
      }
      res.send({ user })})
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(errorMessage.notFoundUser));
      }
      if (err.name === 'CastError') {
        next(new CastError(errorMessage.castError));
      }
    next(err);
    });
};

module.exports.getMyInfo = (req, res, next) => {
  console.log(req.user._id);
  User.findById(req.user._id).orFail(new Error('NotFound'))
    .then((myInfo) => res.send({ myInfo }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(errorMessage.notFoundUser));
      }
      if (err.name === 'CastError') {
        next(new CastError(errorMessage.castError));
      }
    next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar  } = req.body;

  bcrypt.hash(password, 10) //Хэшируем пароль, 10 - длина "соли"
    .then(hash => User.create({ email, password: hash, name, about, avatar  }))
    .then((user) => res.status(200).send({ name,about, avatar, email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError(`${errorMessage.validationError} ${err}`))
      }
      if (err.code === 11000) {
        next(new EmailExistError(errorMessage.emailExistError));
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
        next(new ValidError(`${errorMessage.validationError} ${err}`))
        //return res.status(400).send({ message: errorMessage.validationError, err });
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError(errorMessage.notFoundUser));
        //return res.status(404).send({ message: errorMessage.notFoundUser });
      }
      if (err.name === 'CastError') {
        next(new CastError(errorMessage.castError));
        //return res.status(400).send({ message: errorMessage.castError });
      }
      next(err);
      //return res.status(500).send({ message: err.message });
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
        //return res.status(404).send({ message: errorMessage.notFoundUser });
      }
      if (err.name === 'CastError') {
        next(new CastError(errorMessage.castError));
        //return res.status(400).send({ message: errorMessage.castError });
      }
      if (err.name === 'ValidationError') {
        next(new ValidError(`${errorMessage.validationError} ${err}`))
        //return res.status(400).send({ message: errorMessage.validationError, err });
      }
      next(err);
      //return res.status(500).send({ message: err.message });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if ( !email || !password ) {
    return res.status(400).send({ message: 'Password or email empty' });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      console.log('успешно!');
      const token = jwt.sign({ _id: user._id }, SECRET_JWT, { expiresIn: '7d' }); // в течение недели токен будет действителен

      res.status(200).send({ token });
    })
    .catch((err) => {
      const error = new Error(errorMessage.jwtError);
      error.statusCode = 401;
      next(error);
    });
};
