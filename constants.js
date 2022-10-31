const errorMessage = {
  notFoundUser: 'Запрашиваемый пользователь не найден',
  notFoundCard: 'Карточка не найдена',
  castError: 'Некорректный id',
  validationError: 'Ошибка валидации:',
  jwtError: 'Отсутствие/некорректный токена/токен',
  emailExistError: 'Пользователь с таким email уже зарегестрирован',
  resourseExistError:'Запрашиваемый ресурс не найден '
};
const SECRET_JWT = 'some-secret-key';

module.exports = {errorMessage, SECRET_JWT};
