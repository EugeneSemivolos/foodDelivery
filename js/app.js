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

  const deadline = '2022-08-31';

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
  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    "Меню \"Фитнес\"",
    "Меню \"Фитнес\" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
    4,
    ".menu .container"
  ).render();


  //Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Всё прошло отлично!',
    failure: 'Что-то пошло не так...'
  };

  forms.forEach((form) => {
    postData(form);
  })

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMessage);

      const request = new XMLHttpRequest();
      request.open('POST', 'server.php');

      request.setRequestHeader('Content-type', 'application/json');
      const formData = new FormData(form);

      const obj = {};
      formData.forEach((value, key) => {
        obj[key] = value;
      });

      const json = JSON.stringify(obj);

      request.send(json);

      request.addEventListener('load', () => {
        if (request.status === 200) {
          console.log(request.response);
          showThanksModal(message.success);
          form.reset();
          statusMessage.remove();
        } else {
          showThanksModal(message.failure);
        }
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
});
