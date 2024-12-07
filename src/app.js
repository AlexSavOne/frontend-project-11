// src/app.js

import fetchRSS from './fetchRSS.js';
import parseRSS from './parseRSS.js';
import i18next from './locales/i18n.js';
import createSchema from './validation.js';
import createView from './view.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

console.log('Bootstrap loaded');

const app = async () => {
  await i18next.init();
  console.log('i18next initialized');

  const state = {
    form: { status: 'idle', error: null },
    feeds: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.div_p-example'),
    feedsList: document.querySelector('.feeds'),
    postsList: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
  };

  const watchedState = createView(state, elements);

  const schema = createSchema(state.feeds.map(feed => feed.url));

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { value } = elements.input;
    console.log('Form submitted with URL:', value);

    try {
      const validationResult = await schema.validate({ url: value });
      console.log('Validation successful:', validationResult);
    } catch (validationError) {
      console.log('Form validation error:', validationError);
      watchedState.form.error = validationError.message;
      watchedState.form.status = 'invalid';
      return;
    }

    fetchRSS(value)
      .then((rssText) => {
        if (!rssText) {
          throw new Error('Некорректный ответ от сервера');
        }
        console.log('RSS fetched successfully');
        const { title, description, posts } = parseRSS(rssText);
        console.log('Parsed RSS data:', { title, description, posts });

        const feed = { id: Date.now(), title, description, posts };
        state.feeds.push(feed);

        watchedState.form.status = 'submitted';
        watchedState.feeds = [...state.feeds]; // Обновляем состояние через watchedState
      })
      .catch((err) => {
        console.error('Error fetching RSS:', err);
        watchedState.form.error = i18next.t('validate.networkError');
        watchedState.form.status = 'invalid';
      });
  });

  elements.feedsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      const postLink = e.target.href;
      const postTitle = e.target.textContent;

      console.log('Opening post modal with:', postTitle, postLink);

      elements.modalTitle.textContent = postTitle;
      elements.modalBody.textContent = `Ссылка: ${postLink}`;
      elements.modalLink.href = postLink;
      const modal = new bootstrap.Modal(elements.modal);
      modal.show();
    }
  });
};

export default app;
