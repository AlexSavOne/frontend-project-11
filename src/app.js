// src/app.js

import fetchRSS from './fetchRSS.js';
import parseRSS from './parseRSS.js';
import i18next from './locales/i18n.js';
import createSchema from './validation.js';
import createView from './view.js';
import { createState, markPostAsRead } from './model.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import handlePostPreview from './modal.js';
import updateFeeds from './updateFeeds.js';

const app = async () => {
  await i18next.init();

  const state = createState();

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

  updateFeeds(state, fetchRSS, parseRSS);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { value } = elements.input;
    const schema = createSchema(state.feeds.map((feed) => feed.url));

    try {
      await schema.validate({ url: value });
    } catch (validationError) {
      watchedState.form.error = validationError.message;
      watchedState.form.status = 'invalid';
      return;
    }

    fetchRSS(value)
      .then((rssText) => {
        const { title, description, posts } = parseRSS(rssText);

        const feed = {
          id: Date.now(),
          title,
          description,
          posts,
          url: value,
        };

        state.feeds.push(feed);

        posts.forEach((post) => {
          state.posts.push({ ...post, id: `${feed.id}-${post.title}` });
        });

        watchedState.form.status = 'submitted';
        watchedState.feeds = [...state.feeds];
        watchedState.posts = [...state.posts];
      })
      .catch(() => {
        watchedState.form.error = i18next.t('validate.networkError');
        watchedState.form.status = 'invalid';
      });
  });

  elements.postsList.addEventListener('click', (e) => {
    const button = e.target.closest('.preview-button');
    if (!button) return;

    const postId = button.dataset.id;
    handlePostPreview(state, elements, postId);
    markPostAsRead(state, postId);
    watchedState.readPosts = new Set(state.readPosts);
  });
};

export default app;
