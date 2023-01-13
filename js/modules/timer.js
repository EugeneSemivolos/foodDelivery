const deadline = '2023-04-01';

export function initTimer() {
  setClock('.timer', deadline);
}

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