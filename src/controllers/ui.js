// src/controllers/ui.js

const showFeedbackMessage = (elements) => {
  const feedback = document.createElement('p');
  feedback.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
  feedback.textContent = 'RSS успешно загружен';

  const { exampleText } = elements;
  exampleText.parentNode.insertBefore(feedback, exampleText.nextSibling);
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
