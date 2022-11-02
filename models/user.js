const mongoose = require('mongoose');
const { isEmail, isURL} = require('validator');
const bcrypt = require('bcryptjs');
const Error401 = require('../errors/Error401');
const {errorMessage} = require('../constants');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 40,
    default: 'Жак-Ив Кусто'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (data) => isEmail(data), message: 'Incorrect email',
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (data) => isURL(data), message: 'Incorrect URL-adress',
    }
  },
}, { versionKey: false });

// Функция проверки email и пароля
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error401(errorMessage.errorAuth)); // Отклоняем промис если такого пользователя не нашли
      }

      return bcrypt.compare(password, user.password) // Сравниваем пароль
    .then((matched) => {
        if (!matched) {
           return Promise.reject(new Error401(errorMessage.errorAuth)); // Отклоняем промис при неверном пароле
        }
        return user;
        });
    });

};

module.exports = mongoose.model('user', userSchema);
