// src\models\validation.js

import * as yup from 'yup';
import i18next from 'i18next';

const validation = (url, existingUrls = []) => {
  const schema = yup.object({
    url: yup
      .string()
      .trim()
      .url(i18next.t('validate.invalidURL'))
      .required(i18next.t('validate.shouldNotBeEmpty'))
      .notOneOf(existingUrls, i18next.t('validate.notUniqueURL')),
  });

  return schema.validate({ url });
};

export default validation;
