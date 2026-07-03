import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { createOrder } from './message-api';

import { showLoader, hideLoader } from './loader';

const form = document.querySelector('#contact-form');
const submitBtn = form.querySelector('.btn-submit');
const formLoader = document.querySelector('.contact-form-loader');

function validateForm(data) {
  const errors = {};

  if (!data.name) {
    errors['name-input'] = 'Name is required';
  }

  if (data.name.length < 2) {
    errors['name-input'] = 'Name has to be two or more characters long';
  }
  if (!/^[0-9]{12}$/.test(data.phone)) {
    errors['phone-input'] = 'Phone must contain 12 digits';
  }

  return errors;
}
function getFormData(form) {
  return {
    name: form.elements['name-input'].value.trim(),
    phone: form.elements['phone-input'].value.trim(),
    message: form.elements['message-input'].value.trim(),
  };
}

function showValidationErrors(errors) {
  clearValidationErrors();

  Object.entries(errors).forEach(([fieldId, message]) => {
    const field = document.querySelector(`#${fieldId}`);
    const errorText = document.querySelector(`[data-error-for="${fieldId}"]`);

    field.classList.add('is-invalid');
    errorText.textContent = message;
  });
}

function clearValidationErrors() {
  const fields = form.querySelectorAll('input, textarea');
  const errorTexts = form.querySelectorAll('.error-text');

  fields.forEach(field => field.classList.remove('is-invalid'));
  errorTexts.forEach(error => (error.textContent = ''));
}

form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();

  const name = form.elements['name-input'].value.trim();
  const phone = form.elements['phone-input'].value.trim();
  const message = form.elements['message-input'].value.trim();

  const orderData = getFormData(form);
  const errors = validateForm(orderData);

  if (Object.keys(errors).length > 0) {
    showValidationErrors(errors);
    return;
  }

  clearValidationErrors();

  try {
    showLoader(formLoader);

    await createOrder(orderData);

    iziToast.success({
      message: 'Order created successfully!',
      position: 'topRight',
    });

    form.reset();
  } catch (error) {
    iziToast.error({
      message:
        error.response?.data?.message ||
        error.message ||
        `Something went wrong`,
      position: 'topRight',
    });
  } finally {
    hideLoader(formLoader);
  }
}
