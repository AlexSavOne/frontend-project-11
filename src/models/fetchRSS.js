// src/models/fetchRSS.js

import axios from 'axios';
import parseXML from '../utils/parseXML.js';

const fetchRSS = (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?url=';
  const fullUrl = `${proxyUrl}${encodeURIComponent(url)}&disableCache=true`;

  return axios.get(fullUrl)
    .then((response) => {
      const { contents } = response.data;

      if (!contents) {
        throw new Error('Пустой ответ от сервера');
      }

      const xmlDoc = parseXML(contents);

      if (!xmlDoc.querySelector('rss')) {
        throw new Error('Ресурс не содержит валидный RSS');
      }

      return contents;
    })
    .catch((error) => {
      if (error.message.includes('Ресурс не содержит валидный RSS')) {
        throw new Error('Ресурс не содержит валидный RSS');
      }
      throw new Error('Ошибка сети или прокси');
    });
};

export default fetchRSS;
