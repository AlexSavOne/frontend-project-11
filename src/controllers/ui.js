// src\controllers\ui.js

const showFeedbackMessage = (elements, message, isError = false) => {
  const { exampleText } = elements;

  if (exampleText) {
    const oldFeedback = exampleText.parentNode.querySelector('.feedback');
    if (oldFeedback) {
      oldFeedback.remove();
    }

    const feedback = document.createElement('p');
    feedback.classList.add('feedback', 'm-0', 'position-absolute', 'small');
    feedback.classList.add(isError ? 'text-danger' : 'text-success');
    feedback.textContent = message;

    exampleText.parentNode.insertBefore(feedback, exampleText.nextSibling);
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
  }
};

export { showFeedbackMessage, clearInputField, hideExampleText };
