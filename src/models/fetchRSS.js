// src/fetchRSS.js

import axios from 'axios';

const fetchRSS = (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?url=';
  const fullUrl = `${proxyUrl}${encodeURIComponent(url)}&disableCache=true`;

  return axios.get(fullUrl)
    .then((response) => {
      if (!response.data.contents) {
        throw new Error('Пустой ответ от сервера');
      }
      return response.data.contents;
    })
    .catch((error) => {
      console.log('%cОшибка сети или прокси:', 'color: #e08d63; font-weight: bold;', error);
      throw new Error('Ошибка сети или прокси');
    });
};

export default fetchRSS;
