// src/models/parseRSS.js
const parseRSS = (rssText) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(rssText, 'application/xml');

  const errorNode = parsedData.querySelector('parsererror');
  if (errorNode) {
    const error = new Error(errorNode.textContent);
    error.isParsingError = true;
    throw error;
  }

  const channel = parsedData.querySelector('channel');
  const title = channel.querySelector('title')?.textContent || '';
  const description = channel.querySelector('description')?.textContent || '';
  const items = channel.querySelectorAll('item') || [];

  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title')?.textContent || '',
    link: item.querySelector('link')?.textContent || '#',
    description: item.querySelector('description')?.textContent || '',
  }));

  return { title, description, posts };
};

export default parseRSS;
