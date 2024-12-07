// src/view.js
import onChange from 'on-change';

const createView = (state, elements) => onChange(state, (path, value) => {
  console.log(`Изменение состояния: ${path} =`, value); // Лог изменений состояния

  if (path === 'form.status') {
    const { input, feedback } = elements;

    if (value === 'invalid') {
      console.log('Форма невалидна, ошибка:', state.form.error); // Лог ошибки
      input.classList.add('is-invalid');
      feedback.textContent = state.form.error;
      feedback.classList.add('text-danger');
    }

    if (value === 'valid') {
      console.log('Форма валидна'); // Лог успешной валидации
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    }

    if (value === 'submitted') {
      console.log('Форма успешно отправлена'); // Лог успешной отправки
      input.value = '';
      input.focus();
    }
  }
});

export default createView;
