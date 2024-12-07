// src\locales\i18n.js

import i18next from 'i18next';
import ru from './ru.js';

i18next.init({
  lng: 'ru', // Устанавливаем язык
  resources: {
    ru: {
      translation: ru.translation, // Исправляем путь к переводам
    },
  },
}).then(() => {
  console.log('i18next инициализирован');
  console.log('Текущий язык:', i18next.language); // Лог текущего языка
  console.log('Перевод для "RSS агрегатор":', i18next.t('rssAggregator')); // Пример перевода
}).catch((error) => {
  console.error('Ошибка инициализации i18next:', error);
});

export default i18next;
