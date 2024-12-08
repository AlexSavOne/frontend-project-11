// src\locales\i18n.js

import i18next from 'i18next';
import ru from './ru.js';

i18next.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: ru.translation,
    },
  },
}).catch((error) => {
  console.error('Ошибка инициализации i18next:', error);
});

export default i18next;
