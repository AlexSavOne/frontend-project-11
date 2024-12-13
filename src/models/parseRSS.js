// src/models/parseRSS.js
import i18next from '../locales/i18n.js';

const parseRSS = (rssText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssText, 'application/xml');

  if (xmlDoc.querySelector('parsererror')) {
    throw new Error(i18next.t('validate.urlShouldContainRSS'));
  }

  const channel = xmlDoc.querySelector('channel');
  if (!channel) {
    throw new Error(i18next.t('validate.urlShouldContainRSS'));
  }

  const title = channel.querySelector('title')?.textContent || i18next.t('validate.noChannelTitle');
  const description = channel.querySelector('description')?.textContent || i18next.t('validate.noChannelDescription');
  const items = channel.querySelectorAll('item');

  if (!items.length) {
    throw new Error(i18next.t('validate.noItems'));
  }

  const posts = Array.from(items).map((item, index) => ({
    title: item.querySelector('title')?.textContent || i18next.t('validate.noTitle'),
    link: item.querySelector('link')?.textContent || '#',
    description: item.querySelector('description')?.textContent || i18next.t('validate.noDescription'),
    id: `${Date.now()}-${index}`,
  }));

  return { title, description, posts };
};

export default parseRSS;
