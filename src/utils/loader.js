// src/utils/loader.js

export const showLoader = () => {
  const loader = document.querySelector('#loader');
  if (loader) {
    loader.classList.remove('d-none');
    loader.classList.add('d-flex');
  }
};

export const hideLoader = () => {
  const loader = document.querySelector('#loader');
  if (loader) {
    loader.classList.remove('d-flex');
    loader.classList.add('d-none');
  }
};
