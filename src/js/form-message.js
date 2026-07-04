import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { createOrder } from './message-api';
import { showLoader, hideLoader } from './loader';
import { openSuccessModal } from './success-modal';

// Contact form element
const form = document.querySelector('#contact-form');

// Submit button
const submitBtn = form.querySelector('.btn-submit');

// Form loader overlay
const formLoader = document.querySelector('.contact-form-loader');

// Validate form fields
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

// Get form values
function getFormData(form) {
  return {
    name: form.elements['name-input'].value.trim(),
    phone: form.elements['phone-input'].value.trim(),
    message: form.elements['message-input'].value.trim(),
  };
}

// Display validation errors
function showValidationErrors(errors) {
  clearValidationErrors();

  Object.entries(errors).forEach(([fieldId, message]) => {
    const field = document.querySelector(`#${fieldId}`);
    const errorText = document.querySelector(`[data-error-for="${fieldId}"]`);

    field.classList.add('is-invalid');
    errorText.textContent = message;
  });
}

// Clear validation state
function clearValidationErrors() {
  const fields = form.querySelectorAll('input, textarea');
  const errorTexts = form.querySelectorAll('.error-text');

  fields.forEach(field => field.classList.remove('is-invalid'));
  errorTexts.forEach(error => (error.textContent = ''));
}

// Handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  const orderData = getFormData(form);
  const errors = validateForm(orderData);

  if (Object.keys(errors).length > 0) {
    showValidationErrors(errors);
    return;
  }

  clearValidationErrors();

  try {
    // Show loading state
    showLoader(formLoader);

    await createOrder(orderData);
    form.reset();
    openSuccessModal();
  } catch (error) {
    iziToast.error({
      message:
        error.response?.data?.message ||
        error.message ||
        'Something went wrong',
      position: 'topRight',
    });
  } finally {
    // Hide loading state
    hideLoader(formLoader);
  }
}

// Listen for form submit
form.addEventListener('submit', handleSubmit);
