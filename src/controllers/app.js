// src/controllers/app.js

import i18next from '../locales/i18n.js';
import createView from '../views/view.js';
import { createState, markPostAsRead } from '../models/model.js';
import updateFeeds from './updateFeeds.js';
import handleFormSubmit from './form.js';
import { clearInputField, hideExampleText } from './ui.js';
import handlePostPreview from './modal.js';
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';

const app = async () => {
  await i18next.init();
  const state = createState();

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    exampleText: document.querySelector('.mt-2.mb-0.text-muted'),
    feedsList: document.querySelector('.feeds'),
    postsList: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
  };

  const watchedState = createView(state, elements);
  updateFeeds(state, fetchRSS, parseRSS);

  elements.form.addEventListener('submit', async (e) => {
    const isValid = await handleFormSubmit(e, state, elements, watchedState);
    if (isValid) {
      clearInputField(elements);
      hideExampleText(elements);
      console.log('Данные о постах и канале успешно обновлены');
    }
  });

  elements.postsList.addEventListener('click', (e) => {
    const button = e.target.closest('.preview-button');
    if (!button) return;

    const postId = button.dataset.id;
    handlePostPreview(state, elements, postId);
    markPostAsRead(state, postId);
    watchedState.readPosts = new Set(state.readPosts);

    console.log('Просмотр поста с id:', postId);
  });
};

export default app;
