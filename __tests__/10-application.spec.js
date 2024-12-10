// @ts-check
/* eslint-disable no-useless-escape */

import { URL } from 'url';
import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';

const getFixturePath = (filename) => path.join('..', '__fixtures__', filename);
const readFixture = (filename) => {
  const fixturePath = getFixturePath(filename);

  const rss = fs.readFileSync(new URL(fixturePath, import.meta.url), 'utf-8');
  return rss;
};

const rss1 = readFixture('rss1.xml');
// const rss2 = readFixture('rss2.xml');
// const rss3 = readFixture('rss3.xml');
const rssUrl = 'https://ru.hexlet.io/lessons.rss';

const html = readFixture('document.html');
const htmlUrl = 'https://ru.hexlet.io';

const corsProxy = 'https://allorigins.hexlet.app';
// const corsProxyApi = `${corsProxy}/get`;

let responseHandler;

const getResponseHandler = (page) => (currentRssUrl, data) => (
  page.route(`${corsProxy}/**`, (route) => {
    const url = new URL(route.request().url());
    if (url.pathname !== '/get') {
      console.error('Expect proxified url to have "get" pathname');
      return route.fulfill({ status: 500 });
    }

    if (!url.searchParams.get('disableCache')) {
      console.error('Expect proxified url to have "disableCache" param');
      return route.fulfill({ status: 500 });
    }

    if (url.searchParams.get('url') !== currentRssUrl) {
      console.error('Expect proxified url to have "url" param with correct url');
      return route.fulfill({ status: 500 });
    }

    return route.fulfill({
      status: 200,
      contentType: 'text/xml',
      body: JSON.stringify({ contents: data }),
    });
  })
);

test.beforeEach(async ({ page }) => {
  responseHandler = getResponseHandler(page);

  await page.goto('http://localhost:8080');
  await page.waitForTimeout(300);
});

test('adding', async ({ page }) => {
  page.on('console', console.log);

  // const responseHandler = getResponseHandler(page);
  await responseHandler(rssUrl, rss1);

  await page.locator('input[aria-label="url"]').type(rssUrl);
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('text=RSS успешно загружен', {})).toBeVisible();
});

test('validation (unique)', async ({ page }) => {
  responseHandler(rssUrl, rss1);

  await page.locator('input[aria-label="url"]').type(rssUrl);
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('text=RSS успешно загружен', {})).toBeVisible();

  await page.locator('input[aria-label="url"]').type(rssUrl);
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('text=RSS уже существует', {})).toBeVisible();
});

test('validation (valid url)', async ({ page }) => {
  await page.locator('input[aria-label="url"]').type('wrong');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('text=Ссылка должна быть валидным URL', {})).toBeVisible();
});

test('handling non-rss url', async ({ page }) => {
  responseHandler(htmlUrl, html);
  await page.locator('input[aria-label="url"]').type(htmlUrl);
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('text=Ресурс не содержит валидный RSS', {})).toBeVisible();
});

test('handling network error', async ({ page }) => {
  page.route(`${corsProxy}/**`, (route) => route.abort('internetdisconnected'));

  await page.locator('input[aria-label="url"]').type(rssUrl);
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('text=Ошибка сети', {})).toBeVisible();
});
// TODO: доработать закоментированные тесты
// test.describe('handle disabling ui elements during loading', () => {
//   test('handle successful loading', async ({ page }) => {
//     responseHandler(rssUrl, rss1);

//     // expect(await page.waitForSelector('input[name="url"][disabled=true]')).toBeVisible();
//     expect(await page.locator('input[name="url"]')).toBeEditable();
//     expect(await page.locator('button[type="submit"]')).toBeEnabled();

//     await page.locator('input[name="url"]').type(rssUrl);
//     await page.locator('button[type="submit"]').click();

//     expect(await page.waitForSelector('input[name="url"]', { state: 'disabled' })).toBeTruthy();
//     expect(await page.locator('input[name="url"][readonly=true]',
//      { timeout: 1000 })).toBeVisible();
//     expect(page.locator('button[type="submit"]')).toBeDisabled();

//     expect(await page.locator('input[name="url"]')).toBeEditable();

//     expect(await page.locator('button[type="submit"]')).toBeEnabled();
//   });

//   test('handle failed loading', async ({ page }) => {
//     responseHandler(htmlUrl, html);

//     expect(await page.locator('input[name="url"]')).toBeEditable();
//     expect(await page.locator('button[type="submit"]')).toBeEnabled();

//     await page.locator('input[name="url"]').type(htmlUrl);
//     await page.locator('button[type="submit"]').click();

//     expect(await page.locator('input[name="url"]')).not.toBeEditable();

//     expect(await page.locator('button[type="submit"]')).toBeDisabled();

//     expect(await page.locator('input[name="url"]')).toBeEditable();

//     expect(await page.locator('button[type="submit"]')).toBeEnabled();
//   });
// });

test.describe('load feeds', () => {
  test('render feed and posts', async ({ page }) => {
    responseHandler(rssUrl, rss1);

    await page.locator('input[aria-label="url"]').type(rssUrl);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('text=Новые уроки на Хекслете', {})).toBeVisible();
    await expect(page.locator('text=Практические уроки по программированию', {})).toBeVisible();
    await expect(page.locator('text=Агрегация \/ Python: Деревья', {})).toBeVisible();
    await expect(page.locator('text=Traversal \/ Python: Деревья', {})).toBeVisible();
  });
});

test('modal', async ({ page }) => {
  responseHandler(rssUrl, rss1);

  await page.locator('input[aria-label="url"]').type(rssUrl);
  await page.locator('button[type="submit"]').click();

  const postTitle = await page.locator('a:text("Агрегация \/ Python: Деревья")', {});
  const btn = await page.locator('a:text("Агрегация \/ Python: Деревья") + :text("Просмотр")');

  await expect(postTitle).toHaveClass('fw-bold');
  await btn.click();
  const modalBody = await page.locator('text=Цель: Научиться извлекать из дерева необходимые данные');
  await expect(modalBody).toBeVisible();
  await page.locator('text=Закрыть').first().click();
  await expect(modalBody).not.toBeVisible();
  await expect(postTitle).not.toHaveClass('fw-bold');
});
