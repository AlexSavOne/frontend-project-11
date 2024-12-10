// src/controllers/modal.js

const handlePostPreview = (state, elements, postId) => {
  const post = state.posts.find((p) => p.id === postId);

  if (!post) return;

  const {
    modalTitle,
    modalBody,
    modalLink,
    postsList,
  } = elements;

  modalTitle.textContent = post.title;
  modalBody.textContent = post.description || 'Описание отсутствует';
  modalLink.href = post.link;

  state.readPosts.add(postId);

  const postElement = postsList.querySelector(`[data-id="${postId}"]`);
  if (postElement) {
    const linkElement = postElement.querySelector('a');
    if (linkElement) {
      linkElement.classList.remove('fw-bold');
      linkElement.classList.add('fw-normal', 'link-secondary');
    }
  }
};

export default handlePostPreview;
