let slideIndex = 0;

function moveSlide(step) {
  const slides = document.querySelectorAll('.carousel-slide img');
  const totalSlides = slides.length;

  slideIndex += step;

  if (slideIndex < 0) slideIndex = totalSlides - 1;  // Jeśli jesteśmy na pierwszym, przechodzimy na ostatni
  if (slideIndex >= totalSlides) slideIndex = 0;  // Jeśli jesteśmy na ostatnim, przechodzimy na pierwszy

  const offset = -slideIndex * 100;  // Przemieszczamy kontener o 100% szerokości obrazka
  document.querySelector('.carousel-container').style.transform = `translateX(${offset}%)`;
}
