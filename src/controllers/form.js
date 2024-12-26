/* eslint-disable no-param-reassign */

import validation from '../models/validation.js';
import fetchRSS from '../models/fetchRSS.js';
import i18next from '../locales/i18n.js';

const handleFormSubmit = (e, state, elements, watchedState) => {
  e.preventDefault();

  const formData = new FormData(elements.form);
  const url = formData.get('url').trim();

  watchedState.form.valid = false;
  watchedState.form.error = null;

  return validation(url, state.feeds.map((feed) => feed.url))
    .then(() => {
      watchedState.form.valid = true;
      watchedState.loadingProcess = 'pending';

      fetchRSS(url, watchedState, state);
      elements.input.value = '';
      watchedState.loadingProcess = 'finished';
      return true;
    })
    .catch((error) => {
      watchedState.form.isError = true;
      if (error.message) {
        watchedState.form.errorMessage = i18next.t(error.message);
      }
      watchedState.form.isExampleTextVisible = true;
      watchedState.form.isInputInvalid = true;
      watchedState.loadingProcess = 'rejected';
      return false;
    });
};

export default handleFormSubmit;
