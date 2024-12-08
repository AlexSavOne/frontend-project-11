// src/model.js

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
  console.log(`%cПост с id ${postId} помечен как прочитанный`, 'color: #8e735b; font-weight: bold;');
};
