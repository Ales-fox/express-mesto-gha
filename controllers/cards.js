const Card = require('../models/card');
const errorMessage = require('../constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(new Error('NotFound'))// При отсутствии подходящего id создает ошибку и кидает в блок catch
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: errorMessage.notFoundCard });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: errorMessage.castError });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: errorMessage.validationError, err });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: errorMessage.notFoundCard });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: errorMessage.castError });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: errorMessage.notFoundCard });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: errorMessage.castError });
      }
      return res.status(500).send({ message: err.message });
    });
};
