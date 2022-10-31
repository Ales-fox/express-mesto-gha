const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  /*getUser,*/
  getMyInfo,
  correctUser,
  correctAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

/*router.get('/:userId',celebrate ({
  params: Joi.object().keys({
    cardId: Joi.string().required().id(),
  }).unknown(true),
}), getUser);*/

router.get('/me', celebrate ({
  body: Joi.object().keys({
    _id: Joi.string().required(),
  }).unknown(true),
}), getMyInfo);

router.patch('/me',celebrate ({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2),
  }).unknown(true),
}), correctUser);

router.patch('/me/avatar',celebrate ({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(4) //.regex() или RegExp ?
  }).unknown(true),
}), correctAvatar);

module.exports = router;
