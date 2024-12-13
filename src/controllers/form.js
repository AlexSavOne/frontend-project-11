/* eslint-disable no-param-reassign */

import createSchema from '../models/validation.js';
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';
import i18next from '../locales/i18n.js';
import { showLoader, hideLoader } from '../utils/loader.js';
import { renderFeedbackMessage, toggleExampleText } from '../views/view.js';

const handleFormSubmit = (e, state, elements, watchedState) => {
  e.preventDefault();
  const { value } = elements.input;
  const schema = createSchema(state.feeds.map((feed) => feed.url));

  if (!value.trim()) {
    watchedState.form.errorMessage = i18next.t('validate.shouldNotBeEmpty');
    watchedState.form.isError = true;
    renderFeedbackMessage(elements, watchedState.form.errorMessage, true);
    toggleExampleText(elements, true);
    return Promise.resolve(false);
  }

  return schema
    .validate({ url: value })
    .then(() => {
      watchedState.form.isError = false;
      watchedState.form.errorMessage = '';
      renderFeedbackMessage(elements, '', false);

      showLoader();

      return fetchRSS(value);
    })
    .then((rssText) => {
      const { title, description, posts } = parseRSS(rssText);
      const feedId = Date.now().toString();
      const feed = { id: feedId, title, description, posts, url: value };

      state.feeds.push(feed);
      posts.forEach((post, index) => {
        const postId = `${feedId}-${index}`;
        state.posts.push({ ...post, id: postId });
      });

      watchedState.form.status = 'submitted';
      watchedState.feeds = [...state.feeds];
      watchedState.posts = [...state.posts];

      // Успешное сообщение
      watchedState.form.successMessage = i18next.t('validate.successURL');
      renderFeedbackMessage(elements, watchedState.form.successMessage, false);
      toggleExampleText(elements, true);

      return true;
    })
    .catch((error) => {
      watchedState.form.isError = true;
      watchedState.form.errorMessage = error.message || i18next.t('validate.networkError');
      renderFeedbackMessage(elements, watchedState.form.errorMessage, true);
      toggleExampleText(elements, true);
      return false;
    })
    .finally(() => hideLoader());
};

export default handleFormSubmit;
