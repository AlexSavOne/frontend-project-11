// src/models/parseRSS.js

import parseXML from '../utils/parseXML.js';
import i18next from '../locales/i18n.js';

const parseRSS = (rssText) => {
  const xmlDoc = parseXML(rssText);
  const items = xmlDoc.querySelectorAll('item');

  if (!items.length) {
    throw new Error(i18next.t('validate.urlShouldContainRSS'));
  }

  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title')?.textContent || i18next.t('validate.noTitle');
    const link = item.querySelector('link')?.textContent || '#';
    const description = item.querySelector('description')?.textContent || i18next.t('validate.noDescription');
    return { title, link, description };
  });

  const channel = xmlDoc.querySelector('channel');
  const title = channel.querySelector('title')?.textContent || i18next.t('validate.noChannelTitle');
  const description = channel.querySelector('description')?.textContent || i18next.t('validate.noChannelDescription');

  return { title, description, posts };
};

export default parseRSS;
