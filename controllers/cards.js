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
  Card.findById(req.params.cardId).orFail(new Error('NotFound'))// Если функция не находит элемент с таким id, то создает ошибку и кидает в блок catch
    .then((card) => {
      if (card.owner.toHexString() !== req.user._id) {
        console.log('Нельзя удалить чужую карточку');
        next(new ForbiddenError(errorMessage.forbiddenError));
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then((dataCard) => res.send({ dataCard }))
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        console.log('Такой карточки не существует');
        return next(new NotFoundError(errorMessage.notFoundCard));
      }
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
  ).orFail(new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError(errorMessage.notFoundCard));
      }
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
  ).orFail(new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(errorMessage.notFoundCard));
      } else if (err.name === 'CastError') {
        next(new Error400(errorMessage.castError));
      } else {
        next(err);
      }
    });
};
