// src/models/parseRSS.js

import parseXML from '../utils/parseXML.js';

const parseRSS = (rssText) => {
  const xmlDoc = parseXML(rssText);
  const items = xmlDoc.querySelectorAll('item');

  if (!items.length) {
    throw new Error('Нет постов в RSS');
  }

  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title')?.textContent || 'Без заголовка';
    const link = item.querySelector('link')?.textContent || '#';
    const description = item.querySelector('description')?.textContent || 'Без описания';
    return { title, link, description };
  });

  const channel = xmlDoc.querySelector('channel');
  const title = channel.querySelector('title')?.textContent || 'Без названия канала';
  const description = channel.querySelector('description')?.textContent || 'Без описания канала';

  return { title, description, posts };
};

export default parseRSS;
