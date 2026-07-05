const scrollUpBtn = document.querySelector('.scroll-up-btn');

window.onscroll = function () {
  scrollUpFunction();
};

function scrollUpFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollUpBtn.style.display = 'block';
  } else {
    scrollUpBtn.style.display = 'none';
  }
}

scrollUpBtn.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
