// src/updateFeeds.js

const updateFeeds = (state, fetchRSS, parseRSS) => {
  const checkFeeds = () => {
    const promises = state.feeds.map((feed) => {
      const { url, id } = feed;

      return fetchRSS(url)
        .then((rssText) => {
          const { posts } = parseRSS(rssText);

          const existingPostLinks = new Set(feed.posts.map((post) => post.link));
          const newPosts = posts.filter((post) => !existingPostLinks.has(post.link));

          if (newPosts.length > 0) {
            feed.posts.push(...newPosts);
            console.log(`%cНайдены новые посты для фида ${id}:`, 'color: #98c7c2; font-weight: bold;', newPosts);
          }
        })
        .catch((err) => {
          console.log(`%cОшибка обновления фида ${id}:`, 'color: #e08d63; font-weight: bold;', err);
        });
    });

    Promise.all(promises).finally(() => {
      console.log('%cПроверка фидов завершена, повтор через 5 секунд', 'color: #add8e6; font-weight: bold;');
      setTimeout(checkFeeds, 5000);
    });
  };

  checkFeeds();
};

export default updateFeeds;
