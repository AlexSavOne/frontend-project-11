// src/models/fetchRSS.js
import axios from 'axios';
import i18next from '../locales/i18n.js';

const fetchRSS = (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?url=';
  const fullUrl = `${proxyUrl}${encodeURIComponent(url)}&disableCache=true`;

  return axios.get(fullUrl)
    .then((response) => {
      const { contents } = response.data;
      if (!contents) {
        throw new Error(i18next.t('validate.networkError'));
      }
      return contents;
    })
    .catch(() => {
      throw new Error(i18next.t('validate.networkError'));
    });
};

export default fetchRSS;
