import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { createOrder } from './message-api';
import { showLoader, hideLoader } from './loader';
import { openSuccessModal } from './success-modal';

// Contact form element
const form = document.querySelector('#contact-form');

// Form loader overlay
const formLoader = document.querySelector('.contact-form-loader');

// Form fields
const fields = form.querySelectorAll('input, textarea');

// Validate single field
function validateField(field) {
  const value = field.value.trim();

  if (field.id === 'name-input') {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name has to be two or more characters long';
  }

  if (field.id === 'phone-input') {
    if (!/^[0-9]{12}$/.test(value))
      return 'Phone must contain 12 digits without +';
  }

  return '';
}

// Validate form fields
function validateForm() {
  const errors = {};

  fields.forEach(field => {
    const message = validateField(field);

    if (message) {
      errors[field.id] = message;
    }
  });

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

// Display field error
function showFieldError(field, message) {
  const errorText = document.querySelector(`[data-error-for="${field.id}"]`);

  field.classList.add('is-invalid');
  errorText.textContent = message;
}

// Clear field error
function clearFieldError(field) {
  const errorText = document.querySelector(`[data-error-for="${field.id}"]`);

  field.classList.remove('is-invalid');
  errorText.textContent = '';
}

// Display validation errors
function showValidationErrors(errors) {
  Object.entries(errors).forEach(([fieldId, message]) => {
    const field = document.querySelector(`#${fieldId}`);
    showFieldError(field, message);
  });
}

// Clear validation state
function clearValidationErrors() {
  fields.forEach(clearFieldError);
}

// Handle field blur
function handleFieldBlur(event) {
  const field = event.target;
  const message = validateField(field);

  if (message) {
    showFieldError(field, message);
  }
}

// Handle field focus
function handleFieldFocus(event) {
  clearFieldError(event.target);
}

// Handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  const orderData = getFormData(form);
  const errors = validateForm();

  if (Object.keys(errors).length > 0) {
    showValidationErrors(errors);
    return;
  }

  clearValidationErrors();

  try {
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
    hideLoader(formLoader);
  }
}

// Listen for field events
fields.forEach(field => {
  field.addEventListener('blur', handleFieldBlur);
  field.addEventListener('focus', handleFieldFocus);
});

// Listen for form submit
form.addEventListener('submit', handleSubmit);
