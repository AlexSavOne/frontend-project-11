// src/controllers/app.js
import i18next from '../locales/i18n.js';
import {
  createView, clearInputField, toggleExampleText, renderModal,
} from '../views/view.js';
import { createState, markPostAsRead } from '../models/model.js';
import updateFeeds from './updateFeeds.js';
import handleFormSubmit from './form.js';
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';
import { showLoader, hideLoader } from '../utils/loader.js';

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
        showLoader();

        handleFormSubmit(e, state, elements, watchedState)
          .then((isValid) => {
            if (isValid) {
              clearInputField(elements);
              toggleExampleText(elements, false);
            }
          })
          .finally(() => hideLoader());
      };

      const onPostClick = (e) => {
        const button = e.target.closest('.preview-button');
        if (!button) return;

        const postId = button.dataset.id;
        if (!postId) return;

        renderModal(state, postId, elements);
        markPostAsRead(state, postId);
        watchedState.readPosts = new Set(state.readPosts);
      };

      const onUpdateFeeds = () => {
        updateFeeds(state, fetchRSS, parseRSS)
          .finally(() => hideLoader());
      };

      elements.form.addEventListener('submit', onFormSubmit);
      elements.postsList.addEventListener('click', onPostClick);

      showLoader();
      onUpdateFeeds();
    });
};

export default app;
