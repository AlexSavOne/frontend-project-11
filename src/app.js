// src/app.js
import createSchema from './validation.js';
import createView from './view.js';

const app = () => {
  console.log('Приложение запущено'); // Лог запуска приложения

  const state = {
    form: {
      status: 'idle',
      error: null,
    },
    feeds: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.div_p-example'),
  };

  console.log('Элементы формы:', elements); // Проверка наличия элементов

  // Проверяем, есть ли элементы формы
  if (!elements.form || !elements.input || !elements.feedback) {
    console.error('Не удалось найти элементы формы!'); // Лог ошибки
    return;
  }

  const watchedState = createView(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    console.log('Отправка формы с URL:', value); // Лог введенного URL

    const schema = createSchema(state.feeds);

    schema
      .validate(value)
      .then((url) => {
        console.log('Валидация прошла успешно:', url); // Лог успешной валидации
        watchedState.form.status = 'valid';
        state.feeds.push(url);
        console.log('Обновленный список фидов:', state.feeds); // Лог добавленного URL
        watchedState.form.status = 'submitted';
      })
      .catch((err) => {
        console.log('Ошибка валидации:', err.message); // Лог ошибки валидации
        watchedState.form.error = err.message;
        watchedState.form.status = 'invalid';
      });
  });
};

export default app;
