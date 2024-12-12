/* eslint-disable no-param-reassign */

import createSchema from '../models/validation.js';
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';
import i18next from '../locales/i18n.js';
import { withLoader } from '../utils/loader.js';
import {
  renderFeedbackMessage,
  toggleInvalidInputClass,
  hideExampleText,
  showExampleText,
} from '../views/view.js';

const handleFormSubmit = (e, state, elements, watchedState) => {
  e.preventDefault();
  const { value } = elements.input;
  const schema = createSchema(state.feeds.map((feed) => feed.url));

  if (!value.trim()) {
    toggleInvalidInputClass(elements, true);
    renderFeedbackMessage(elements, i18next.t('validate.shouldNotBeEmpty'), true);
    showExampleText(elements);
    return Promise.resolve(false);
  }

  return schema
    .validate({ url: value })
    .then(() => {
      toggleInvalidInputClass(elements, false);
      hideExampleText(elements);
      return withLoader(() => fetchRSS(value));
    })
    .then((rssText) => {
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

      watchedState.form.status = 'submitted';
      watchedState.feeds = [...state.feeds];
      watchedState.posts = [...state.posts];

      renderFeedbackMessage(elements, i18next.t('validate.successURL'), false);
      return true;
    })
    .catch((error) => {
      toggleInvalidInputClass(elements, true);
      renderFeedbackMessage(elements, error.message || i18next.t('validate.networkError'), true);
      showExampleText(elements);
      return false;
    });
};

export default handleFormSubmit;
