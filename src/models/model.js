// src\models\model.js

export const createState = () => ({
  feeds: [],
  posts: [],
  readPosts: new Set(),
  form: {
    status: 'valid',
    error: '',
  },
});

export const markPostAsRead = (state, postId) => {
  state.readPosts.add(postId);
};
