const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ValidError = require('../errors/ValidError');
const ForbiddenError = require('../errors/ForbiddenError');
const { errorMessage } = require('../constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(new Error('NotFound'))// При отсутствии подходящего id создает ошибку и кидает в блок catch
    .then((card) => {
      if (!card) {
        next(new NotFoundError(errorMessage.notFoundCard))
      }
      if (card.owner.toString()!==req.user._id) {
        next(new ForbiddenError(errorMessage.forbiddenError));
      }
      res.send({ data: card })})
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(errorMessage.notFoundCard));
      }
      if (err.name === 'CastError') {
        next(new CastError(errorMessage.castError));
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError(`${errorMessage.validationError} ${err}`))
      }
      next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => {
      if (!card) {
        next(new NotFoundError(errorMessage.notFoundCard));
      }
      res.send({ data: card })})
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(errorMessage.notFoundCard));
      }
      if (err.name === 'CastError') {
        next(new CastError(errorMessage.castError));
      }
      next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => {
      if (!card) {
        next(new NotFoundError(errorMessage.notFoundCard));
      }
      res.send({ data: card })})
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(errorMessage.notFoundCard));
      }
      if (err.name === 'CastError') {
        next(new CastError(errorMessage.castError));
      }
      next(err);
    });
};
