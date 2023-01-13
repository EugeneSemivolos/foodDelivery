const slides = document.querySelectorAll('.offer__slide'),
      slider = document.querySelector('.offer__slider'),
      prev = document.querySelector('.offer__slider-prev'),
      next = document.querySelector('.offer__slider-next'),
      total = document.querySelector('#total'),
      current = document.querySelector('#current'),
      slidesWrapper = document.querySelector('.offer__slider-wrapper'),
      slidesField = document.querySelector('.offer__slider-inner'),
      width = window.getComputedStyle(slidesWrapper).width,
      dots = [];
let slideIndex = 1;
let offset = 0;

export function initSlider() {
  total.textContent = formatNumberTo00(slides.length);
  current.textContent = formatNumberTo00(slideIndex);

  slidesField.style.width = 100 * slides.length + '%';
  
  slides.forEach(slide => {
    slide.style.width = width;
  });
  createIndicators();
  addEventListeners();
}

function createIndicators() {
  const indicators = document.createElement('ol');
  indicators.classList.add('carousel-indicators');
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.classList.add('dot');
    if (i == 0) {
      dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
  }
}

function addEventListeners() {
  next.addEventListener('click', () => {
    if (offset == getPureNumber(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += getPureNumber(width);
    }
    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }
    showSlide(offset, slideIndex);
  });

  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = getPureNumber(width) * (slides.length - 1);
    } else {
      offset -= getPureNumber(width);
    }
    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }
    showSlide(offset, slideIndex);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to');
      slideIndex = slideTo;
      offset = getPureNumber(width) * (slideTo - 1);

      showSlide(offset, slideIndex);
    });
  });
}

function showSlide(offset, slideIndex) {
  slidesField.style.transform = `translateX(-${offset}px)`;
  current.textContent = formatNumberTo00(slideIndex);
  dots.forEach(dot => dot.style.opacity = '.5');
  dots[slideIndex - 1].style.opacity = 1;
}

function formatNumberTo00(number) {
  if (number < 10) {
    return `0${number}`;
  } else {
    return number;
  }
}

function getPureNumber(str) {
  let res = '';
  for (const symbol of str) {
    if (symbol.match(/\d/g)) res += symbol;
  }
  return +res;
}