import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';

const faqList = document.querySelector('.faq-list');

const accordionSettings = {
  duration: 400,
  showMultiple: false,
  elementClass: 'faq-item',
  triggerClass: 'faq-btn',
  panelClass: 'faq-answer-wrapper',
};

const faqAccordion = new Accordion(faqList, accordionSettings);
