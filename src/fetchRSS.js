// src/fetchRSS.js

import axios from 'axios';

const fetchRSS = async (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?url=';
  const fullUrl = `${proxyUrl}${encodeURIComponent(url)}&disableCache=true`;

  console.log('Fetching RSS data from:', fullUrl); // Лог запроса на получение RSS

  try {
    const response = await axios.get(fullUrl);
    if (!response.data.contents) {
      throw new Error('Пустой ответ от сервера');
    }
    console.log('RSS response received:', response.data); // Лог ответа на запрос
    return response.data.contents; // Возвращаем содержимое канала
  } catch (error) {
    console.error('Error fetching RSS:', error); // Лог ошибки запроса
    throw new Error('Ошибка сети или прокси');
  }
};

export default fetchRSS;
