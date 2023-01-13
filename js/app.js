import { initTabs } from './modules/tabs.js';
import { initTimer } from './modules/timer.js';
import { initSlider } from './modules/slider.js';
import { initCalculator } from './modules/calculator.js';
import { MenuCard } from './modules/menuCard.js';
import { initModal, showThanksModal } from './modules/modal.js';
import { getData, postData } from './modules/requests.js';

const message = {
  loading: 'img/form/spinner.svg',
  success: 'Всё прошло отлично!',
  failure: 'Что-то пошло не так...'
};

const links = {
  json_server: {
    menu: 'http://localhost:3000/menu',
    requests: 'http://localhost:3000/requests',
  }
}

window.addEventListener('DOMContentLoaded', () => {

  initTabs();
  initTimer();
  initSlider();  
  initCalculator();
  initModal();

  getData(links.json_server.menu)
  .then(data => {
    data.forEach(({img, altimg, title, descr, price}) => {
      new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    });
  })

  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    bindPostData(form);
  });

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMessage);
  
      const jsonData = formatDataToJSON(form);
      postData(links.json_server.requests, jsonData)
        .then(data => {
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
  
  function formatDataToJSON(form) {
    const formData = new FormData(form);
    const json = JSON.stringify(Object.fromEntries(formData.entries()));
  
    return json;
  }
});
