/* eslint-disable no-param-reassign */

import validation from '../models/validation.js';
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';
import i18next from '../locales/i18n.js';
import { showLoader, hideLoader } from '../utils/loader.js';

const handleFormSubmit = (e, state, elements, watchedState) => {
  e.preventDefault();

  const formData = new FormData(elements.form);
  const url = formData.get('url').trim();

  state.form.valid = false;
  state.form.error = null;
  watchedState.form.isError = false;
  watchedState.form.isExampleTextVisible = false;
  watchedState.form.isInputInvalid = false;
  watchedState.form.errorMessage = '';
  watchedState.form.feedbackMessage = '';

  if (!url) {
    state.form.valid = false;
    state.form.error = 'validate.shouldNotBeEmpty';
    watchedState.form.errorMessage = i18next.t(state.form.error);
    watchedState.form.isError = true;
    watchedState.form.isExampleTextVisible = true;
    watchedState.form.isInputInvalid = true;
    return Promise.resolve(false);
  }

  watchedState.loadingProcess = 'pending';

  return validation(url, state.feeds.map((feed) => feed.url))
    .then(() => {
      watchedState.form.isError = false;
      watchedState.form.errorMessage = '';
      watchedState.form.isInputInvalid = false;
      watchedState.form.isExampleTextVisible = false;

      showLoader();
      return fetchRSS(url);
    })
    .then((rssText) => {
      const { title, description, posts } = parseRSS(rssText);
      const feedId = Date.now().toString();
      const feed = {
        id: feedId, title, description, posts, url,
      };

      state.feeds.push(feed);
      posts.forEach((post, index) => {
        const postId = `${feedId}-${index}`;
        state.posts.push({ ...post, id: postId });
      });

      watchedState.feeds = [...state.feeds];
      watchedState.posts = [...state.posts];
      watchedState.form.status = 'submitted';
      watchedState.form.isExampleTextVisible = false;
      watchedState.form.feedbackMessage = i18next.t('validate.successURL');
      watchedState.form.isError = false;

      elements.input.value = '';
      watchedState.loadingProcess = 'finished';

      return true;
    })
    .catch((error) => {
      watchedState.form.isError = true;

      if (error.isAxiosError) {
        watchedState.loadingProcess = 'error';
        state.form.error = 'validate.networkError';
      } else if (error.message === 'Invalid RSS') {
        state.form.error = 'validate.urlShouldContainRSS';
      } else {
        state.form.error = `${error.message}` || 'validate.unknownError';
      }

      watchedState.form.errorMessage = i18next.t(state.form.error);
      watchedState.form.isExampleTextVisible = true;
      watchedState.form.isInputInvalid = true;
      return false;
    })
    .finally(() => {
      hideLoader();
      state.loading = 'success';
    });
};

export default handleFormSubmit;
