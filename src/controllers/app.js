// src/controllers/app.js
import i18next from '../locales/i18n.js';
import createView from '../views/view.js';
import { createState, markPostAsRead } from '../models/model.js';
import updateFeeds from './updateFeeds.js';
import handleFormSubmit from './form.js';

const app = () => {
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

      const onFormSubmit = (e) => {
        e.preventDefault();
        state.loading = 'loading';

        handleFormSubmit(e, state, elements, watchedState)
          .then((isValid) => {
            if (isValid) {
              elements.input.value = '';
              watchedState.renderPosts();
            }
            watchedState.toggleExampleText(!isValid);
          })
          .finally(() => {
            state.loading = 'success';
          });
      };

      const onPostClick = (e) => {
        const postId = e.target.dataset.id;
        if (!postId) return;

        watchedState.renderModal(postId);
        markPostAsRead(state, postId);
      };

      elements.form.addEventListener('submit', onFormSubmit);
      elements.postsList.addEventListener('click', onPostClick);

      updateFeeds(watchedState);
    });
};

export default app;
