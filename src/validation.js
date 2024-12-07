// src/validation.js
import * as yup from 'yup';

const createSchema = (existingUrls) => {
  console.log('Существующие URL:', existingUrls); // Проверка списка фидов
  return yup
    .string()
    .url('Некорректный URL')
    .notOneOf(existingUrls, 'RSS уже добавлен');
};

export default createSchema;
