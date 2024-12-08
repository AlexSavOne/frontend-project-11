// src/view.js
import onChange from 'on-change';

const createView = (state, elements) => onChange(state, (path, value) => {
  if (path === 'feeds') {
    const { feedsList, postsList } = elements;
    feedsList.innerHTML = '';
    postsList.innerHTML = '';

    value.forEach((feed) => {
      feedsList.insertAdjacentHTML('beforeend', `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${feed.title}</h5>
            <p class="card-text">${feed.description}</p>
          </div>
        </div>
      `);

      const postsHtml = feed.posts.map((post, index) => `
        <li class="list-group-item fw-bold" data-id="${feed.id}-${index}">
          <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="text-decoration-none">${post.title}</a>
          <button type="button" class="btn btn-outline-primary btn-sm preview-button" data-id="${feed.id}-${index}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
        </li>
      `).join('');

      postsList.insertAdjacentHTML('beforeend', `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${feed.title}</h5>
            <ul class="list-group list-group-flush">${postsHtml}</ul>
          </div>
        </div>
      `);
    });
  }
});

export default createView;
