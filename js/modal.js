/** Modal references */
let modalRef;
let closeButtonRef;
let backdropRef;

const create = (children) => {
  modalRef = document.createElement("div");
  modalRef.classList.add("modal");
  modalRef.innerHTML = `
    <div class="modal-wrapper d-flex justify-between">
      <button class="close button" id="modal-close-button">
        <i class="fas fa-times"></i>
      </button>
      ${children}
      </div>
      <div class="modal-backdrop"></div>
    `;
  document.body.appendChild(modalRef);
  open();
};

const remove = () => {
  document.body.style.overflow = "initial";
  modalRef.classList.remove("open");

  /** Remove the modal, after fade effect is over */
  setTimeout(() => document.body.removeChild(modalRef), 200);
};

const open = () => {
  document.body.style.overflow = "hidden";
  setTimeout(() => modalRef.classList.add("open"), 0);

  closeButtonRef = document.getElementById("modal-close-button");
  backdropRef = document.querySelector(".modal-backdrop");

  [closeButtonRef, backdropRef].forEach(bindEvent);
};

const bindEvent = (ref) => ref.addEventListener("click", remove);

export default { create };
