// src/models/fetchRSS.js
import axios from 'axios';
import parseXML from '../utils/parseXML.js';
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

      let xmlDoc;
      try {
        xmlDoc = parseXML(contents);
      } catch (err) {
        throw new Error(i18next.t('validate.urlShouldContainRSS'));
      }

      if (!xmlDoc.querySelector('rss')) {
        throw new Error(i18next.t('validate.urlShouldContainRSS'));
      }

      return contents;
    })
    .catch((err) => {
      if (err.message === i18next.t('validate.urlShouldContainRSS')) {
        throw new Error(i18next.t('validate.urlShouldContainRSS'));
      }
      throw new Error(i18next.t('validate.networkError'));
    });
};

export default fetchRSS;
