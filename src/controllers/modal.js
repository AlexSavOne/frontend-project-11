// src/modal.js

const handlePostPreview = (state, elements, postId) => {
  console.log('%chandlePostPreview вызван с postId:', 'color: #7f9c5c; font-weight: bold;', postId);

  const post = state.posts.find((p) => p.id === postId);
  if (!post) {
    console.error('%cПост не найден!', 'color: #e08d63; font-weight: bold;');
    return;
  }

  const {
    modalTitle,
    modalBody,
    modalLink,
    postsList,
  } = elements;

  modalTitle.textContent = post.title;
  modalBody.textContent = post.description || 'Описание отсутствует';
  modalLink.href = post.link;

  console.log('%cДанные модального окна обновлены:', 'color: #7f9c5c; font-weight: bold;', {
    title: modalTitle.textContent,
    body: modalBody.textContent,
    link: modalLink.href,
  });

  state.readPosts.add(postId);

  const postElement = postsList.querySelector(`[data-id="${postId}"]`);
  if (postElement) {
    postElement.classList.replace('fw-bold', 'fw-normal');
    console.log('%cПост помечен как прочитанный:', 'color: #8e735b; font-weight: bold;', postId);
  } else {
    console.warn('%cЭлемент поста не найден в DOM:', 'color: #f0a87e; font-weight: bold;', postId);
  }
};

export default handlePostPreview;
