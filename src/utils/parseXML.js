// src/utils/parseXML.js
const parseXML = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  if (xmlDoc.querySelector('parsererror')) {
    throw new Error('Ошибка парсинга XML');
  }

  return xmlDoc;
};

export default parseXML;
