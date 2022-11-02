const errorMessage = {
  notFoundUser: 'Запрашиваемый пользователь не найден',
  notFoundCard: 'Карточка не найдена',
  castError: 'Некорректный id',
  validationError: 'Ошибка валидации:',
  jwtError: 'Отсутствие/некорректный токена/токен',
  emailExistError: 'При регистрации указан email, который уже существует на сервере',
  resourseExistError: 'Запрашиваемый ресурс не найден',
  forbiddenError: 'Доступ к запрошеному ресурсу запрещен',
  errorAuth: 'Неправильная почта или пароль'
};
const SECRET_JWT = 'some-secret-key';
const avatarPatternValidation = /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/;
// /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.[\w-]{1,32}))(:\d{2,5})?((\/.+)+)?\/?#?/ 
// /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/
module.exports = {errorMessage, SECRET_JWT, avatarPatternValidation};
