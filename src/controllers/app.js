// src/controllers/app.js
import i18next from '../locales/i18n.js';
import { createView, clearInputField, hideExampleText } from '../views/view.js';
import { createState, markPostAsRead } from '../models/model.js';
import updateFeeds from './updateFeeds.js';
import handleFormSubmit from './form.js';
import handlePostPreview from './modal.js';
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';
import { withLoader } from '../utils/loader.js';

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
          throw new Error(`Элемент ${key} не найден! Проверьте разметку.`);
        }
      });

      const watchedState = createView(state, elements, i18next);

      return withLoader(() => updateFeeds(state, fetchRSS, parseRSS, watchedState.renderPosts))
        .then(() => {
          elements.form.addEventListener('submit', (e) => {
            handleFormSubmit(e, state, elements, watchedState)
              .then((isValid) => {
                if (isValid) {
                  clearInputField(elements);
                  hideExampleText(elements);
                }
              });
          });

          elements.postsList.addEventListener('click', (e) => {
            const button = e.target.closest('.preview-button');
            if (!button) return;

            const postId = button.dataset.id;
            if (!postId) return;

            handlePostPreview(state, elements, postId);
            markPostAsRead(state, postId);

            watchedState.readPosts = new Set(state.readPosts);
          });
        });
    });
};

export default app;
