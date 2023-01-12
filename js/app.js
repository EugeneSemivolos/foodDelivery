window.addEventListener('DOMContentLoaded', () => {
  //tabs

  const tabs = document.querySelectorAll('.tabheader__item');
  const tabsContent = document.querySelectorAll('.tabcontent');
  const tabsParent = document.querySelector('.tabheader__items');

  function changeTabContent(i = 0) {
    for (const item of tabsContent) {
      item.style.display = 'none';
    }
    for (const tab of tabs) {
      tab.classList.remove('tabheader__item_active');
    }
    tabsContent[i].style.display = 'block';
    tabs[i].classList.add('tabheader__item_active');

  }

  changeTabContent();

  tabsParent.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (e.target === item) changeTabContent(i);
      });
    }
  });


  //timer

  const deadline = '2023-04-01';

  function setClock(selector, endTime) {
    const timer = document.querySelector(selector);
    const days = timer.querySelector('#days');
    const hours = timer.querySelector('#hours');
    const minutes = timer.querySelector('#minutes');
    const seconds = timer.querySelector('#seconds');

    updateClock();
    const timeInterval = setInterval(updateClock, 1000);

    function updateClock() {
      const time = getRemainingTime(endTime);
      days.innerHTML = formatDate(time.days);
      hours.innerHTML = formatDate(time.hours);
      minutes.innerHTML = formatDate(time.minutes);
      seconds.innerHTML = formatDate(time.seconds);

      if (time.totalTime <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  function getRemainingTime(endTime) {
    const totalTime = Date.parse(endTime) - new Date();
    if (totalTime <= 0) {
      return { totalTime: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    const days = Math.floor(totalTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(totalTime / (1000 * 60 * 60) % 24);
    const minutes = Math.floor(totalTime / (1000 * 60) % 60);
    const seconds = Math.floor(totalTime / 1000 % 60);
    return { totalTime, days, hours, minutes, seconds };
  }

  function formatDate(date) {
     return date < 10 ? '0' + date : date;
  }

  setClock('.timer', deadline);

  //modal

  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modal = document.querySelector('.modal');
  const modalCloseBtn = document.querySelector('[data-close]');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerID);
  }

  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  for (const modalTrigger of modalTriggers) {
    modalTrigger.addEventListener('click', openModal);
  }

  modalCloseBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const modalTimerID = setTimeout(openModal, 3000);

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }
    changeToUAH() {
      this.price *= this.transfer;
    }

    render() {
      const element = document.createElement('div');
      element.innerHTML = `
        <div class="menu__item">
          <img src=${this.src} alt=${this.alt}>
          <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
          </div>
        </div>
      `;
      this.parent.append(element);
    }
  }

  const getResource = async (url, data) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url} status: ${res.status}`);
    }

    return await res.json(); 
  };

  getResource('http://localhost:3000/menu')
  .then(data => {
    data.forEach(({img, altimg, title, descr, price}) => {
      new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    });
  })

  //Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Всё прошло отлично!',
    failure: 'Что-то пошло не так...'
  };

  forms.forEach((form) => {
    bindPostData(form);
  })


  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
    });

    return await res.json(); 
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
      .then(data => {
        console.log(data);
        showThanksModal(message.success);
        statusMessage.remove();
      })
      .catch(() => {
        showThanksModal(message.failure);
      })
      .finally(() => {
        form.reset();
      });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 3000);
  }

  fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));

    //Slider

  const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;
    
  let slideIndex = 1;
  let offset = 0;

  if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
    } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
    }

  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';

  slidesWrapper.style.overflow = 'hidden';
  
  slides.forEach(slide => {
    slide.style.width = width;
  });

  next.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  });

  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  });
    // showSlides(slideIndex);

    // if (slides.length < 10) {
    //   total.textContent = `0${slides.length}`;
    // } else {
    //   total.textContent = slides.length;
    // }

    // function showSlides(n) {
    //   if (n > slides.length) {
    //     slideIndex = 1;
    //   }

    //   if (n < 1) {
    //     slideIndex = slides.length;
    //   }

    //   slides.forEach(slide => slide.style.display = 'none');

    //   slides[slideIndex - 1].style.display = 'block';

    //   if (slides.length < 10) {
    //     current.textContent = `0${slideIndex}`;
    //   } else {
    //     current.textContent = slideIndex;
    //   }
    // }

    // function plusSlides(n) {
    //   slideIndex += n;
    //   showSlides(slideIndex)
    // }

    // prev.addEventListener('click', () => {
    //   plusSlides(-1);
    // });

    // next.addEventListener('click', () => {
    //   plusSlides(1);
    // });
});
