// src/validation.js

import * as yup from 'yup';
import i18next from 'i18next';

const createSchema = (existingUrls = []) => yup.object({
  url: yup
    .string()
    .url(i18next.t('validate.invalidURL'))
    .required(i18next.t('validate.requiredURL'))
    .notOneOf(existingUrls, i18next.t('validate.notUniqueURL')),
});

export default createSchema;
