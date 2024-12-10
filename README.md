# Проект "RSS-агрегатор"

## Описание

Проект **"RSS-агрегатор"** представляет собой веб-приложение для чтения и управления RSS-каналами и постами. С помощью этого приложения пользователи могут добавлять RSS-каналы, просматривать их посты и помечать прочитанные. В проекте реализована простая и понятная архитектура с использованием паттерна MVC, а также обработка ошибок и валидация введённых данных.

## Цели проекта

- Разработка функционала для добавления и отображения RSS-каналов.
- Реализация отображения постов с возможностью просмотра полного текста.
- Валидация введённых URL с использованием схемы Yup.
- Реализация архитектуры MVC для чёткого разделения логики.
- Локализация интерфейса с использованием библиотеки i18next.
- Обработка ошибок при загрузке и добавлении данных.

## Особенности проекта

- **Адаптивный интерфейс**: приложение использует только стандартную сетку Bootstrap для обеспечения адаптивности на различных устройствах.
- **Поддержка нескольких RSS-каналов**: можно добавлять несколько каналов и получать обновления по каждому из них.
- **Реализация состояния с помощью on-change**: автоматически обновляется UI при изменении данных.
- **Валидация данных**: схема валидации с использованием библиотеки Yup для проверки правильности URL и данных.
- **Локализация интерфейса**: поддержка разных языков с помощью i18next, включая русский.

## Файловая структура

- **`/src/controllers`**: контроллеры, управляющие логикой приложения, включая работу с формами, модальными окнами и обновления данных.
- **`/src/models`**: модели для работы с данными, включая обработку RSS-данных и валидацию URL.
- **`/src/views`**: представления, отвечающие за рендеринг данных на экран.
- **`/src/locales`**: файлы локализации приложения.
- **`/src/assets`**: стили и другие ресурсы.
- **`/src/index.js`**: основной файл приложения, инициализирующий всё приложение.

## Технологии

- **JavaScript (ES6)**: основной язык разработки.
- **Yup**: библиотека для валидации данных.
- **Bootstrap**: для создания адаптивного интерфейса.
- **i18next**: библиотека для локализации.
- **Webpack**: для сборки проекта и оптимизации.
- **Axios**: для работы с HTTP-запросами.
- **on-change**: для отслеживания изменений в состоянии и автоматического обновления интерфейса.
- **Sass**: для написания стилей.
- **ESLint**: для поддержания качества кода.
- **Node.js**: для серверной части приложения (если понадобится).

### Hexlet tests and linter status:

[![Actions Status](https://github.com/AlexSavOne/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/AlexSavOne/frontend-project-11/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/125f37e469d85032346c/maintainability)](https://codeclimate.com/github/AlexSavOne/frontend-project-46/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/125f37e469d85032346c/test_coverage)](https://codeclimate.com/github/AlexSavOne/frontend-project-46/test_coverage)
![Vercel Status](https://img.shields.io/vercel/deploys/alexsavones-projects/frontend-project-11.svg)
![Vercel Deploy Status](https://img.shields.io/endpoint?url=https://api.vercel.com/v1/projects/7ZBN4ELDLjEFh9CePyc8WDYCZ927/status)
![Vercel Status](https://img.shields.io/vercel/deploys/frontend-project-11-seven-eta)
![Vercel Deploy Status](https://img.shields.io/endpoint?url=https://api.vercel.com/v1/projects/frontend-project-11-seven-eta/status)
![Vercel Status](https://img.shields.io/vercel/deploys/frontend-project-11-seven-eta)
![Vercel Status](https://img.shields.io/vercel/deploys/frontend-project-11-git-main-alexsavones-projects)
![Vercel Status](https://img.shields.io/vercel/deploys/frontend-project-11-7wl3sgdt3-alexsavones-projects)
