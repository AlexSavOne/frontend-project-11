// src/controllers/updateFeeds.js

const updateFeeds = (state, fetchRSS, parseRSS) => {
  const checkFeeds = () => {
    const promises = state.feeds.map((feed) => {
      const { url } = feed;

      return fetchRSS(url)
        .then((rssText) => {
          const { posts } = parseRSS(rssText);
          const existingPostLinks = new Set(feed.posts.map((post) => post.link));
          const newPosts = posts.filter((post) => !existingPostLinks.has(post.link));
          if (newPosts.length > 0) {
            feed.posts.push(...newPosts);
          }
        });
    });

    return Promise.all(promises).finally(() => {
      setTimeout(checkFeeds, 5000);
    });
  };

  return checkFeeds();
};

export default updateFeeds;
