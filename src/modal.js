// src/modal.js

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
  modalBody.textContent = post.description;
  modalLink.href = post.link;

  state.readPosts.add(postId);

  const postElement = postsList.querySelector(`[data-id="${postId}"]`);
  if (postElement) {
    postElement.classList.remove('fw-bold');
    postElement.classList.add('fw-normal');
  }
};

export default handlePostPreview;
