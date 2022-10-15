// Импорт(подключение) модулей
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
// Подключение базы данных
mongoose.connect(MONGO_URL);
// Создание приложения
const app = express();

// Подключаем возможность обработки json объектов запросами
// Всегда выше запросов где это используется
// Можно подключить только к 1 конкретному запросу
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63485da03d79643ca0b698b4', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(router);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
