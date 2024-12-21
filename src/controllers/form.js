/* eslint-disable no-param-reassign */

import createSchema from '../models/validation.js';
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';
import i18next from '../locales/i18n.js';
import { showLoader, hideLoader } from '../utils/loader.js';

const handleFormSubmit = (e, state, elements, watchedState) => {
  e.preventDefault();

  const formData = new FormData(elements.form);
  const url = formData.get('url').trim();

  if (!url) {
    watchedState.form.errorMessage = i18next.t('validate.shouldNotBeEmpty');
    watchedState.form.isError = true;
    watchedState.form.isExampleTextVisible = true;
    watchedState.form.isInputInvalid = true;
    return Promise.resolve(false);
  }

  const schema = createSchema(state.feeds.map((feed) => feed.url));

  return schema
    .validate({ url })
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
      return true;
    })
    .catch((error) => {
      watchedState.form.isError = true;
      watchedState.form.errorMessage = error.message || i18next.t('validate.networkError');
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
