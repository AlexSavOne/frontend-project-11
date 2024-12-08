// src/views/view.js

import onChange from 'on-change';

const createView = (state, elements) => onChange(state, (path, value) => {
  if (path === 'feeds') {
    const { feedsList, postsList } = elements;
    feedsList.innerHTML = '';
    postsList.innerHTML = '';

    const feedsHeader = document.createElement('div');
    feedsHeader.classList.add('card-body');
    feedsHeader.innerHTML = '<h2 class="card-title h4">Фиды</h2>';
    feedsList.appendChild(feedsHeader);

    value.forEach((feed) => {
      feedsList.insertAdjacentHTML('beforeend', `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${feed.title}</h5>
            <p class="card-text">${feed.description}</p>
          </div>
        </div>
      `);

      const postsHtml = feed.posts.map((post, index) => {
        const postClass = state.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold';
        return `
          <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0 ${postClass}" data-id="${feed.id}-${index}">
            <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="text-decoration-none">${post.title}</a>
            <button type="button" class="btn btn-outline-primary btn-sm preview-button" data-id="${feed.id}-${index}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
          </li>
        `;
      }).join('');

      postsList.insertAdjacentHTML('beforeend', `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${feed.title}</h5>
            <ul class="list-group list-group-flush">${postsHtml}</ul>
          </div>
        </div>
      `);
    });

    const postsHeader = document.createElement('div');
    postsHeader.classList.add('card-body');
    postsHeader.innerHTML = '<h2 class="card-title h4">Посты</h2>';
    postsList.insertAdjacentElement('afterbegin', postsHeader);

    console.log('%cОтображение данных о каналах и постах обновлено', 'color: #7f9c5c; font-weight: bold;');
  }
});

export default createView;
