// Импорт(подключение) модулей
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const router = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorMessage, avatarPatternValidation } = require('./constants');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
// Подключение базы данных
mongoose.connect(MONGO_URL);
// Создание приложения
const app = express();

// Подключаем возможность обработки json объектов запросами
// Всегда выше запросов где это используется
// Можно подключить только к 1 конкретному запросу
app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(avatarPatternValidation),
  }).unknown(true),
}), createUser);

// авторизация
app.use(auth);

app.use(router);
// Ошибка на неизвестные роуты
app.use('*', (req, res, next) => {
  next(new NotFoundError(errorMessage.resourseExistError));
});

// Обработчик ошибок celebrate
app.use(errors());
// Централизованный обработчик ошибок, находится ниже всех но до PORT
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
