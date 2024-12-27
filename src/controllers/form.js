/* eslint-disable no-param-reassign */

import validation from '../models/validation.js';
import fetchRSS from '../models/fetchRSS.js';
import i18next from '../locales/i18n.js';

const handleFormSubmit = (e, state, elements, watchedState) => {
  e.preventDefault();

  const formData = new FormData(elements.form);
  const url = formData.get('url').trim();

  return validation(url, state.feeds.map((feed) => feed.url))
    .then(() => {
      watchedState.form = {
        ...watchedState.form,
        valid: true,
        error: null,
      };

      fetchRSS(url, watchedState, state);
      elements.form.reset();
      return true;
    })
    .catch((error) => {
      watchedState.form = {
        ...watchedState.form,
        isError: true,
        valid: false,
        error: i18next.t(error.message),
      };
      if (error.message) {
        watchedState.form.errorMessage = i18next.t(error.message);
        watchedState.form.isInputInvalid = true;
      }
      return false;
    });
};

export default handleFormSubmit;
