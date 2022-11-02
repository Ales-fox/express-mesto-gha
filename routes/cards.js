const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { avatarPatternValidation } = require('../constants');

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

// К пути добавляется еще предыдущее /cards из файла index
router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    link: Joi.string().required().min(4).pattern(avatarPatternValidation),
  }).unknown(true),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24)
      .pattern(/[a-f0-9]{24,24}/),
  }).unknown(true),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24)
      .pattern(/[a-f0-9]{24,24}/),
  }).unknown(true),
}), putLike);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24)
      .pattern(/[a-f0-9]{24,24}/),
  }).unknown(true),
}), deleteLike);

module.exports = router;
