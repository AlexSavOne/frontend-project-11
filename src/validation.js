// src/validation.js

import * as yup from 'yup';
import i18next from 'i18next';

const createSchema = (existingUrls = []) => { // Пустой массив по умолчанию
  console.log('Существующие URL:', existingUrls); // Проверка списка фидов

  return yup.object({
    url: yup
      .string()
      .url(i18next.t('validate.invalidURL')) // Правильная строка перевода
      .required(i18next.t('validate.requiredURL')) // Ошибка, если URL пустой
      .notOneOf(existingUrls, i18next.t('validate.notUniqueURL')), // Перевод для ошибки "RSS уже добавлен"
  });
};

export default createSchema;
