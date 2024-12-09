import i18next from 'i18next';
import ru from './ru.js';

i18next.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: ru.translation,
    },
  },
});

export default i18next;
