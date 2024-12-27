// src/models/fetchRSS.js
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';
import i18next from '../locales/i18n.js';
import parseRSS from './parseRSS.js';

const fetchRSS = (url, watchedState, state) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?url=';
  const fullUrl = `${proxyUrl}${encodeURIComponent(url)}&disableCache=true`;

  return axios.get(fullUrl)
    .then((response) => {
      const { contents } = response.data;
      if (!contents) {
        throw new Error('network');
      }

      const { title, description, posts } = parseRSS(contents);

      if (!title || !posts) {
        throw new Error('noRss');
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

      watchedState.form.isError = false;
      watchedState.form.feedbackMessage = i18next.t('validate.successURL');

      watchedState.loadingProcess = 'fulfilled';
    })
    .catch((error) => {
      const determineErrorType = (err) => {
        switch (true) {
          case err?.isParsingError:
            return 'noRss';
          case err?.isAxiosError:
            return 'network';
          default:
            return 'unknown';
        }
      };

      watchedState.loadingProcess = {
        status: 'failed',
        error: determineErrorType(error),
      };

      watchedState.form.errorMessage = i18next.t(`validate.${watchedState.loadingProcess.error}`);
    });
};

export default fetchRSS;
