const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { avatarPatternValidation } = require('../constants');

const {
  getUsers,
  getUser,
  getMyInfo,
  correctUser,
  correctAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getMyInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24)
      .id()
      .pattern(/[a-f0-9]{24,24}/),
  }).unknown(true),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), correctUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(4).pattern(avatarPatternValidation),
  }).unknown(true),
}), correctAvatar);

module.exports = router;
