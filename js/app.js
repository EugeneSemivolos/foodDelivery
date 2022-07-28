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
});
