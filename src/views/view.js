// src/views/view.js

import onChange from 'on-change';

const renderFeedbackMessage = (elements, message, isError = false) => {
  const { exampleText } = elements;

  if (exampleText) {
    const oldFeedback = exampleText.parentNode.querySelector('.feedback');
    if (oldFeedback) {
      oldFeedback.remove();
    }

    const feedback = document.createElement('p');
    feedback.classList.add('feedback', 'm-0', 'position-absolute', 'small');
    feedback.classList.add(isError ? 'text-danger' : 'text-success');
    feedback.textContent = message;

    exampleText.parentNode.insertBefore(feedback, exampleText.nextSibling);
  }
};

const clearInputField = (elements) => {
  const { input } = elements;
  input.value = '';
};

const hideExampleText = (elements) => {
  const { exampleText } = elements;

  if (exampleText) {
    exampleText.style.opacity = '0';
  }
};

const showExampleText = (elements) => {
  const { exampleText } = elements;

  if (exampleText) {
    exampleText.style.opacity = '1';
  }
};

const toggleInvalidInputClass = (elements, isInvalid) => {
  const { input } = elements;
  if (isInvalid) {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
};

const createView = (state, elements, i18nextInstance) => {
  const { feedsList, postsList } = elements;

  if (!feedsList || !postsList) {
    throw new Error(i18nextInstance.t('view.initError'));
  }

  const renderPosts = () => {
    feedsList.innerHTML = `<h2 class="card-title h4">${i18nextInstance.t('view.feedsTitle')}</h2>`;
    postsList.innerHTML = `<h2 class="card-title h4">${i18nextInstance.t('view.postsTitle')}</h2>`;

    state.feeds.forEach((feed) => {
      const feedItem = document.createElement('div');
      feedItem.classList.add('card', 'mb-3');
      feedItem.setAttribute('data-id', feed.id);
      feedItem.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${feed.title}</h5>
          <p class="card-text">${feed.description}</p>
        </div>
      `;

      feedsList.appendChild(feedItem);

      feed.posts.forEach((post, index) => {
        const uniqueId = `${feed.id}-${index}`;
        const postClass = state.readPosts.has(uniqueId) ? 'fw-normal' : 'fw-bold';
        const postItem = document.createElement('li');
        postItem.classList.add(
          'list-group-item',
          'd-flex',
          'justify-content-between',
          'align-items-start',
          'border-0',
          'border-end-0',
          postClass,
        );
        postItem.setAttribute('data-id', uniqueId);

        postItem.innerHTML = `
          <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="fw-bold">${post.title}</a>
          <button type="button" class="btn btn-outline-primary btn-sm preview-button" data-id="${uniqueId}" data-bs-toggle="modal" data-bs-target="#modal">${i18nextInstance.t('validate.openPostPreview')}</button>
        `;

        postsList.appendChild(postItem);
      });
    });
  };

  return onChange(state, (path) => {
    if (path === 'feeds' || path === 'posts') {
      renderPosts();
    }
  });
};

export {
  createView,
  renderFeedbackMessage,
  clearInputField,
  hideExampleText,
  showExampleText,
  toggleInvalidInputClass,
};
