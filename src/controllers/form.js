import onChange from 'on-change';
import createSchema from '../models/validation.js';
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';
import i18next from '../locales/i18n.js';
import { showFeedbackMessage } from './ui.js';
import { withLoader } from '../utils/loader.js';

const handleFormSubmit = (e, state, elements, watchedState) => {
  e.preventDefault();
  const { value } = elements.input;
  const schema = createSchema(state.feeds.map((feed) => feed.url));

  if (!value.trim()) {
    const updatedWatchedState = onChange(watchedState, () => { });
    updatedWatchedState.form = {
      ...watchedState.form,
      error: i18next.t('validate.shouldNotBeEmpty'),
      status: 'invalid',
    };
    elements.input.classList.add('is-invalid');
    showFeedbackMessage(elements, updatedWatchedState.form.error, true);
    return updatedWatchedState;
  }

  return schema
    .validate({ url: value })
    .then(() => {
      elements.input.classList.remove('is-invalid');
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

      const updatedWatchedState = onChange(watchedState, () => { });
      updatedWatchedState.form.status = 'submitted';
      updatedWatchedState.feeds = [...state.feeds];
      updatedWatchedState.posts = [...state.posts];

      showFeedbackMessage(elements, i18next.t('validate.successURL'), false);
      return updatedWatchedState;
    })
    .catch((error) => {
      elements.input.classList.add('is-invalid');

      const updatedWatchedState = onChange(watchedState, () => { });
      updatedWatchedState.form = {
        ...watchedState.form,
        error: error.message || i18next.t('validate.networkError'),
        status: 'invalid',
      };

      showFeedbackMessage(elements, updatedWatchedState.form.error, true);
      return updatedWatchedState;
    });
};

export default handleFormSubmit;
