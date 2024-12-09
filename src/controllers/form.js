// src/controllers/form.js

import onChange from 'on-change';
import createSchema from '../models/validation.js';
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';
import i18next from '../locales/i18n.js';
import { showLoader, hideLoader } from '../utils/loader.js';
import { showFeedbackMessage } from './ui.js';

const handleFormSubmit = async (e, state, elements, watchedState) => {
  e.preventDefault();
  const { value } = elements.input;
  const schema = createSchema(state.feeds.map((feed) => feed.url));

  showLoader();

  try {
    // Выполнение валидации URL
    await schema.validate({ url: value });

    const rssText = await fetchRSS(value);
    const { title, description, posts } = parseRSS(rssText);

    const feedId = Date.now().toString();
    const feed = {
      id: feedId, title, description, posts, url: value,
    };

    state.feeds.push(feed);
    posts.forEach((post, index) => {
      const postId = `${feedId}-${index}`;
      state.posts.push({ ...post, id: postId });
    });

    const updatedWatchedState = onChange(watchedState, () => { });
    updatedWatchedState.form.status = 'submitted';
    updatedWatchedState.feeds = [...state.feeds];
    updatedWatchedState.posts = [...state.posts];

    // Показать сообщение об успешной загрузке RSS
    showFeedbackMessage(elements, i18next.t('validate.successURL'), false);

    return updatedWatchedState;
  } catch (error) {
    const updatedWatchedState = onChange(watchedState, () => { });
    updatedWatchedState.form = {
      ...watchedState.form,
      error: error.message || i18next.t('validate.networkError'),
      status: 'invalid',
    };

    // Показать сообщение об ошибке
    showFeedbackMessage(elements, updatedWatchedState.form.error, true);

    console.error('Ошибка при валидации или получении данных RSS:', error.message);
    return updatedWatchedState;
  } finally {
    hideLoader();
  }
};

export default handleFormSubmit;