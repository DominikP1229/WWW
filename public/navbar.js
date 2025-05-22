
const navButton = document.getElementById('nav_button');
const nav = document.getElementById('page_nav');
const navImg = navButton.querySelector('img');

navButton.addEventListener('click', () => {
nav.classList.toggle('active');

navImg.classList.add('rotating');

navImg.addEventListener('animationend', () => {
    navImg.classList.remove('rotating');
}, { once: true });
});

