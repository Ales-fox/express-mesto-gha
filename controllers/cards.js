const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const Error400 = require('../errors/Error400');
const ForbiddenError = require('../errors/ForbiddenError');
const { errorMessage } = require('../constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  // Если функция не находит эл-т с таким id, то метод orFail создает ошибку и кидает в блок catch
  Card.findById(req.params.cardId).orFail(new NotFoundError(errorMessage.notFoundCard))
    .then((card) => {
      if (card.owner.toHexString() !== req.user._id) {
        throw new ForbiddenError(errorMessage.forbiddenError);
      }

      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((dataCard) => res.send({ dataCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400(errorMessage.castError));
      }
      return next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400(errorMessage.validationError));
      }
      return next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавляет _id в массив, если его там нет
    { new: true },
  ).orFail(new NotFoundError(errorMessage.notFoundCard))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400(errorMessage.castError));
      }
      return next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убирает _id из массива
    { new: true },
  ).orFail(new NotFoundError(errorMessage.notFoundCard))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400(errorMessage.castError));
      } else {
        next(err);
      }
    });
};
