const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#navLinks');

burgerIcon.addEventListener('click', () => {
   navbarMenu.classList.toggle('is-active');
})