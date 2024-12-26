// src/models/fetchRSS.js
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';
import i18next from '../locales/i18n.js';
import parseRSS from './parseRSS.js';

const fetchRSS = (url, watchedState, state) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?url=';
  const fullUrl = `${proxyUrl}${encodeURIComponent(url)}&disableCache=true`;

  if (watchedState) {
    watchedState.loadingProcess = 'pending';
    watchedState.form.isError = false;
    watchedState.form.errorMessage = '';
    watchedState.form.feedbackMessage = '';
  }

  return axios.get(fullUrl)
    .then((response) => {
      const { contents } = response.data;
      if (!contents) {
        throw new Error(i18next.t('validate.networkError'));
      }

      const { title, description, posts } = parseRSS(contents);

      if (!title || !posts) {
        throw new Error(i18next.t('validate.urlShouldContainRSS'));
      }

      const feedId = _.uniqueId('feed_');
      state.feeds.push({
        id: feedId, title, description, posts, url,
      });

      posts.forEach((post) => {
        const postId = _.uniqueId('post_');
        state.posts.push({ ...post, id: postId, feedId });
      });

      watchedState.feeds = [...state.feeds];
      watchedState.posts = [...state.posts];

      watchedState.form.feedbackMessage = i18next.t('validate.successURL');
      watchedState.form.isError = false;
      watchedState.form.isExampleTextVisible = false;
      watchedState.form.isInputInvalid = false;

      if (watchedState) {
        watchedState.loadingProcess = 'fulfilled';
      }
    })
    .catch((error) => {
      watchedState.form.isError = true;

      if (watchedState) {
        watchedState.loadingProcess = 'rejected';
      }

      if (error.isAxiosError) {
        state.form.error = 'validate.networkError';
      } else if (error.message === 'Invalid RSS') {
        state.form.error = 'validate.urlShouldContainRSS';
      } else {
        state.form.error = error.message || 'validate.unknownError';
      }

      if (error.message) {
        watchedState.form.errorMessage = i18next.t(error.message);
      }

      watchedState.form.errorMessage = i18next.t(state.form.error);
      watchedState.form.isExampleTextVisible = true;
      watchedState.form.isInputInvalid = true;
    });
};

export default fetchRSS;
