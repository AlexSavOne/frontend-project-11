// src/view.js

import onChange from 'on-change';

const createView = (state, elements) => onChange(state, (path, value) => {
  if (path === 'form.status') {
    const { input, feedback } = elements;

    console.log(`Form status changed: ${value}`);

    if (value === 'invalid') {
      input.classList.add('is-invalid');
      feedback.textContent = state.form.error;
      feedback.classList.add('text-danger');
    }

    if (value === 'valid') {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    }

    if (value === 'submitted') {
      input.value = '';
      input.focus();
    }
  }

  if (path === 'feeds') {
    const feedsList = elements.feedsList;
    feedsList.innerHTML = '';
    console.log('Rendering feeds:', value);
    value.forEach((feed) => {
      console.log('Rendering feed:', feed);

      const feedElement = document.createElement('div');
      feedElement.classList.add('card', 'mb-3');

      feedElement.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${feed.title}</h5>
          <p class="card-text">${feed.description}</p>
          <a href="#" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#feed-${feed.id}" aria-expanded="false" aria-controls="feed-${feed.id}">
            Смотреть посты
          </a>
          <div class="collapse" id="feed-${feed.id}">
            <ul class="list-group list-group-flush">
              ${feed.posts.map(post => `
                <li class="list-group-item">
                  <a href="${post.link}" target="_blank" class="text-decoration-none">${post.title}</a>
                </li>`).join('')}
            </ul>
          </div>
        </div>
      `;

      feedsList.appendChild(feedElement);
    });
  }
});

export default createView;
