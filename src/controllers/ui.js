// src/controllers/ui.js

const showFeedbackMessage = (elements, message, isError = false) => {
  // Получаем контейнер для примера текста
  const { exampleText } = elements;

  if (exampleText) {
    // Скрываем старое сообщение с помощью opacity
    exampleText.style.opacity = '0';

    // Создаем новый элемент сообщения
    const feedback = document.createElement('p');
    feedback.classList.add('feedback', 'm-0', 'position-absolute', 'small');

    // Устанавливаем правильный класс для сообщения (красный или зеленый)
    feedback.classList.add(isError ? 'text-danger' : 'text-success');

    feedback.textContent = message;

    // Вставляем новое сообщение после старого элемента
    exampleText.parentNode.insertBefore(feedback, exampleText.nextSibling);
  } else {
    console.error('Элемент с классом .mt-2.mb-0.text-muted не найден');
  }
};

const clearInputField = (elements) => {
  const { input } = elements;
  input.value = '';
};

const hideExampleText = (elements) => {
  const { exampleText } = elements;

  if (exampleText) {
    exampleText.style.opacity = '0';
  } else {
    console.error('Элемент с классом .mt-2.mb-0.text-muted не найден');
  }
};

export { showFeedbackMessage, clearInputField, hideExampleText };
