const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

// К пути добавляется еще предыдущее /cards из файла index
router.get('/', getCards);

router.post('/',celebrate ({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    link: Joi.string().required().min(4).pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/), //.regex() или RegExp ?
  }).unknown(true),
}),createCard);

router.delete('/:cardId',celebrate ({
  params: Joi.object().keys({
    cardId: Joi.string().required().id().alphanum(),
  }).unknown(true),
}), deleteCard);

router.put('/:cardId/likes',celebrate ({
  params: Joi.object().keys({
    cardId: Joi.string().required().id().alphanum(),
  }).unknown(true),
}), putLike);

router.delete('/:cardId/likes',celebrate ({
  params: Joi.object().keys({
    cardId: Joi.string().required().id().alphanum(),
  }).unknown(true),
}), deleteLike);

module.exports = router;
