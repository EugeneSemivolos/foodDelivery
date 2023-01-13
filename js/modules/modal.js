export const delay = {
  firstAppearance: 3000,
  thanksModal: 4000,
} 

const modalTriggers = document.querySelectorAll("[data-modal]");
const modal = document.querySelector(".modal");
const modalCloseBtn = document.querySelector("[data-close]");
const modalTimerID = setTimeout(openModal, delay.firstAppearance);

function openModal() {
  modal.classList.add("show");
  modal.classList.remove("hide");
  document.body.style.overflow = "hidden";
  clearInterval(modalTimerID);
}

function closeModal() {
  modal.classList.add("hide");
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function showModalByScroll() {
  const { clientHeight, scrollHeight } = document.documentElement;
  if (window.pageYOffset + clientHeight >= scrollHeight - 1) {
    openModal();
    window.removeEventListener("scroll", showModalByScroll);
  }
}

export function initModal() {
  for (const modalTrigger of modalTriggers) {
    modalTrigger.addEventListener("click", openModal);
  }
  modalCloseBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) closeModal();
  });
  window.addEventListener("scroll", showModalByScroll);
}

export function showThanksModal(message) {
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
  }, delay.thanksModal);
}
