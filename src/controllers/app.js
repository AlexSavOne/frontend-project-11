// src/controllers/app.js
import i18next from '../locales/i18n.js';
import createView from '../views/view.js';
import updateFeeds from './updateFeeds.js';
import handleFormSubmit from './form.js';

const app = () => {
  const createState = () => ({
    feeds: [],
    posts: [],
    readPosts: new Set(),
    form: {
      valid: true,
      error: null,
      loadingProcess: null,
    },
  });

  i18next.init()
    .then(() => {
      const state = createState();
      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('#url-input'),
        exampleText: document.querySelector('.div_p-example'),
        feedsList: document.querySelector('.feeds'),
        postsList: document.querySelector('.posts'),
        modal: document.querySelector('#modal'),
        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        modalLink: document.querySelector('.full-article'),
      };

      Object.keys(elements).forEach((key) => {
        if (!elements[key]) {
          throw new Error(i18next.t('view.initError'));
        }
      });

      const watchedState = createView(state, elements, i18next);

      elements.form.addEventListener('submit', (e) => handleFormSubmit(e, state, elements, watchedState));

      elements.postsList.addEventListener('click', (e) => {
        const postId = e.target.dataset.id;
        if (!postId) return;

        watchedState.modalId = postId;
        state.readPosts.add(postId);
      });

      updateFeeds(watchedState);
    });
};

export default app;
