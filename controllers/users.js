const User = require('../models/user');
const errorMessage = require('../constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    .populate('name')
    .then((users) => res.send({ users }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: errorMessage.notFoundUser });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: errorMessage.castError });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: errorMessage.validationError, err });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.correctUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: errorMessage.validationError, err });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: errorMessage.notFoundUser });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: errorMessage.castError });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.correctAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).orFail(new Error('NotFound'))
    .then((users) => res.send({ users }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: errorMessage.notFoundUser });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: errorMessage.castError });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: errorMessage.validationError, err });
      }
      return res.status(500).send({ message: err.message });
    });
};
