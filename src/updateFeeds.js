// src/updateFeeds.js

const updateFeeds = (state, fetchRSS, parseRSS) => {
  const checkFeeds = () => {
    const promises = state.feeds.map((feed) => {
      const { url, id } = feed;

      return fetchRSS(url)
        .then((rssText) => {
          const { posts } = parseRSS(rssText);

          // Проверяем, есть ли новые посты
          const existingPostLinks = new Set(feed.posts.map((post) => post.link));
          const newPosts = posts.filter((post) => !existingPostLinks.has(post.link));

          if (newPosts.length > 0) {
            feed.posts.push(...newPosts); // Добавляем новые посты в фид
            console.log(`Найдены новые посты для фида ${id}:`, newPosts);
          }
        })
        .catch((err) => {
          console.error(`Ошибка обновления фида ${id}:`, err);
        });
    });

    // После выполнения всех запросов повторяем проверку через 5 секунд
    Promise.all(promises).finally(() => {
      setTimeout(checkFeeds, 5000);
    });
  };

  // Запускаем первый цикл проверки
  checkFeeds();
};

export default updateFeeds;
