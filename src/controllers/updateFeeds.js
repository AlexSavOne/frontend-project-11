// src/controllers/updateFeeds.js
/* eslint-disable no-param-reassign */
import fetchRSS from '../models/fetchRSS.js';
import parseRSS from '../models/parseRSS.js';

const updateFeeds = (watchedState) => {
  const checkFeeds = () => {
    if (!Array.isArray(watchedState.feeds) || watchedState.feeds.length === 0) {
      setTimeout(checkFeeds, 5000);
      return;
    }

    const promises = watchedState.feeds.map((feed) => {
      const { url, posts = [] } = feed;

      return fetchRSS(url)
        .then((rssText) => {
          const { posts: newPosts } = parseRSS(rssText);
          const existingPostLinks = new Set(posts.map((post) => post.link));
          const freshPosts = newPosts.filter((post) => !existingPostLinks.has(post.link));

          if (freshPosts.length > 0) {
            feed.posts = [...posts, ...freshPosts];
          }
        })
        .catch(() => { });
    });

    Promise.all(promises)
      .finally(() => {
        setTimeout(checkFeeds, 5000);
      });
  };

  checkFeeds();
};

export default updateFeeds;
