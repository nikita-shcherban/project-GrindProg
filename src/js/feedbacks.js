import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { getFeedbacks } from './feedbacks-api.js';

const listEl = document.querySelector('.feedbacks-list');
let swiperInstance = null;

function createFeedbackMarkup({ descr, name }) {
  return `
    <li class="swiper-slide feedbacks-item">
      <p class="feedbacks-descr-text">"${descr}"</p>
      <p class="feedbacks-author">${name}</p>
    </li>
  `;
}

async function renderFeedbacks() {
  try {
    const feedbacks = await getFeedbacks(9, 1);
    listEl.innerHTML = feedbacks.map(createFeedbackMarkup).join('');
    initSwiper();
  } catch (error) {
    listEl.innerHTML = `<li class="feedbacks-error">Failed to load feedbacks.</li>`;
  }
}

function initSwiper() {
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
  }

  swiperInstance = new Swiper('.feedbacks-swiper', {
    modules: [Navigation, Pagination, Keyboard, A11y],
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    keyboard: { enabled: true },
    a11y: true,
    navigation: {
      nextEl: '.feedbacks-btn-next',
      prevEl: '.feedbacks-btn-prev',
      disabledClass: 'feedbacks-btn--disabled',
    },
    pagination: {
      el: '.feedbacks-pagination',
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 3,
    },
    breakpoints: {
      768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
      1440: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
    },
  });
}

renderFeedbacks();
