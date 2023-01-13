const result = document.querySelector('.calculating__result span');
const caloryData = {
  sex: 'female',
  height: 0, 
  weight: 0, 
  age: 0, 
  ratio: 1.375,
}

export function initCalculator() {
  getStaticInfo('#gender', 'calculating__choose-item_active');
  getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

  getDynamicInfo('#height');
  getDynamicInfo('#weight');
  getDynamicInfo('#age');
}

function calcTotal() {
  const { sex, height, weight, age, ratio } = caloryData;
  if (!sex || !height || !weight || !age || !ratio) {
    result.textContent = '0';
    return;
  }
  if (sex === 'female') {
    result.textContent = caloriesForWomen(weight, height, age, ratio);
  } else {
    result.textContent = caloriesForMen(weight, height, age, ratio);
  }
}

function caloriesForWomen(weight, height, age, ratio) {
  return Math.round((447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio);
}

function caloriesForMen(weight, height, age, ratio) {
  return Math.round((88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio);
}

function getStaticInfo(parentSelector, activeClass) {
  const elements = document.querySelectorAll(`${parentSelector} div`);

  elements.forEach(elem => elem.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-ratio')) {
      caloryData.ratio = +e.target.getAttribute('data-ratio');
    } else {
      caloryData.sex = e.target.getAttribute('id');
    }

    elements.forEach(elem => {
      elem.classList.remove(activeClass);
    });

    e.target.classList.add(activeClass);
    calcTotal();
  }));
}

function getDynamicInfo(selector) {
  const input = document.querySelector(selector);

  input.addEventListener('input', () => {

    if (input.value.match(/\D/g)) {
      input.style.border = '1px solid red';
    } else {
      input.style.border = 'none';
    }

    switch(input.getAttribute('id')) {
      case 'height':
        caloryData.height = +input.value;
        break;
      case 'weight':
        caloryData.weight = +input.value;
        break;
      case 'age':
        caloryData.age = +input.value;
        break;
    }
    calcTotal();
  });
}