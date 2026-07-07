const headerMenuButton = document.querySelector('.header-burger-btn');
const headerMenuButtonIconUse = document.querySelector(
  '.header-menu-icon > use'
);
const header = document.querySelector('.header');

function updateMenuIcon(isMobileMenuOpen) {
  const useElementHref = headerMenuButtonIconUse.getAttribute('href');
  const [basePath] = useElementHref.split('#');

  headerMenuButtonIconUse.setAttribute(
    'href',
    `${basePath}#${isMobileMenuOpen ? 'icon-close' : 'icon-burger'}`
  );
}

function closeMenu() {
  header.classList.remove('mobile-menu-open');
  headerMenuButton.ariaLabel = 'Open navigation menu';
  updateMenuIcon(false);
  document.body.style.overflow = '';
}

function toggleMenu() {
  const isMobileMenuOpen = header.classList.toggle('mobile-menu-open');

  headerMenuButton.ariaLabel = isMobileMenuOpen
    ? 'Close navigation menu'
    : 'Open navigation menu';

  updateMenuIcon(isMobileMenuOpen);
  document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
}

headerMenuButton.addEventListener('click', toggleMenu);

header.addEventListener('click', event => {
  const isMobileMenuOpen = header.classList.contains('mobile-menu-open');
  const isMenuItemClicked = event.target.classList.contains('header-nav-link');

  if (isMobileMenuOpen && isMenuItemClicked) {
    closeMenu();
  }
});

// Close mobile menu on tablet and desktop
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    closeMenu();
  }
});
