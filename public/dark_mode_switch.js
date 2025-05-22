
const themeToggle = document.getElementById('themeToggle');

if (localStorage.getItem('theme') === 'dark') {
document.body.setAttribute('data-theme', 'dark');
themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
if (themeToggle.checked) {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
} else {
    document.body.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
}
});

