export function initTabs() {
    
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
}