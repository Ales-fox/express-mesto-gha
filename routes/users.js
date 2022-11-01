const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  getMyInfo,
  correctUser,
  correctAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', celebrate ({
  body: Joi.object().keys({
    _id: Joi.string().required().id().alphanum().pattern(/[a-f0-9]{24,24}/),
  }).unknown(true),
}), getMyInfo);

router.get('/:userId',celebrate ({
  body: Joi.object().keys({
    _id: Joi.string().required().id().alphanum().pattern(/[a-f0-9]{24,24}/),
  }).unknown(true),
}), getUser);


router.patch('/me',celebrate ({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), correctUser);

router.patch('/me/avatar',celebrate ({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(4).pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/), //.regex() или RegExp ?
  }).unknown(true),
}), correctAvatar);

module.exports = router;
