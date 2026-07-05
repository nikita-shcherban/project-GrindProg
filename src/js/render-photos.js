import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { showLoader, hideLoader } from './loader';
import { getCategories, getWeddingPhotos } from './portfolio-api';

const portfoliSectionElement = document.querySelector('.portfolio-section');

const categoryList = portfoliSectionElement.querySelector(
  '.portfolio-category'
);
const imagesList = portfoliSectionElement.querySelector('.portfolio-images');
const buttonElement = portfoliSectionElement.querySelector('.show-more-button');
const loaderElement = portfoliSectionElement.querySelector('.loader');
const loaderWrapperElement = portfoliSectionElement.querySelector(
  '.portfolio-loader-wrapper'
);

let selectedCategory = document.querySelector('#all-photos');

const LIMIT_IMAGES_PER_SHOW_MORE = 3;

let countTotalImages = 0;
let countShowedImages = 0;
let countShowMoreClicks = 0;

renderCategories();
renderBasicImages();

categoryList.addEventListener('click', handleClickCategory);
buttonElement.addEventListener('click', handleShowMoreClick);

async function handleShowMoreClick() {
  countShowMoreClicks++;
  try {
    showLoader(loaderWrapperElement);
    const data = await getWeddingPhotos(
      selectedCategory.id,
      LIMIT_IMAGES_PER_SHOW_MORE + countShowMoreClicks,
      LIMIT_IMAGES_PER_SHOW_MORE
    );
    countShowedImages += data.weddingPhotos.length;
    toggleShowMoreButton();
    const list = data.weddingPhotos.map(
      img => `<li><img src="${img.img}" alt="${img.title}"/></li>`
    );
    imagesList.insertAdjacentHTML('beforeend', list.join(''));
  } catch {
    iziToast.error({
      message: 'Something went wrong with request',
      position: 'bottomRight',
    });
  } finally {
    hideLoader(loaderWrapperElement);
  }
}
function handleClickCategory(e) {
  countShowMoreClicks = 0;
  countShowedImages = 0;
  countTotalImages = 0;

  if (e.target.tagName !== 'LI') {
    return;
  }

  selectedCategory.removeAttribute('class');
  selectedCategory = e.target;
  e.target.classList.add('selected-category');
  if (e.target.id === 'all-photos') {
    renderBasicImages();
  } else {
    renderBasicImages(e.target.id);
  }
}

async function renderCategories() {
  try {
    const categories = await getCategories();
    const list = categories.map(
      img => `<li id=${img._id}>${img.category}</li>`
    );
    categoryList.insertAdjacentHTML('beforeend', list.join(''));
  } catch (error) {
    console.log(error);
    iziToast.error({
      message: 'Something went wrong with Category request',
      position: 'bottomRight',
    });
  }
}

async function renderBasicImages(category = undefined) {
  imagesList.innerHTML = '';
  try {
    showLoader(loaderWrapperElement);
    const images = await getWeddingPhotos(category);
    countTotalImages = images.totalItems;
    countShowedImages += images.weddingPhotos.length;
    toggleShowMoreButton();
    const list = images.weddingPhotos.map(
      img => `<li><img src="${img.img}" alt="${img.title}"/></li>`
    );
    imagesList.insertAdjacentHTML('beforeend', list.join(''));
  } catch (error) {
    console.log(error);
    iziToast.error({
      message: 'Something went wrong with request',
      position: 'bottomRight',
    });
  } finally {
    hideLoader(loaderWrapperElement);
  }
}

function toggleShowMoreButton() {
  if (countShowedImages === countTotalImages) {
    buttonElement.disabled = true;
  } else {
    buttonElement.disabled = false;
  }
}
