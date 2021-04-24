import { storage } from "./helpers.js";

const addressInputRef = document.querySelector("[data-role='addressInput']");
const paymentMethodInputsRef = [
  ...document.querySelectorAll("[data-role='paymentMethodInput']"),
];
const totalAmountFieldRef = document.querySelector("[data-role='totalAmount']");
const addressFieldRef = document.querySelector("[data-role='address']");
const paymentMethodFieldRef = document.querySelector(
  "[data-role='paymentMethod']"
);

const basketContent = document.querySelector(".basket-content");

const totalBasketAmount = Number(storage.get("basketAmount")) || 0;
const currentBasket = storage.get("basket") || [];
const currencyCode = currentBasket[0].saleInfo.listPrice.currencyCode;

const createBasketItem = ({ count, volumeInfo, saleInfo }) =>
  `
  <div class="basket-item d-flex align-center">
    <div class="basket-item-image">
      <img
        src=${volumeInfo.imageLinks.thumbnail}
        alt=${volumeInfo.title}
        width="75px"
      />
    </div>
    <div class="basket-item-detail d-flex align-center justify-between">
      <div class="basket-item-info d-flex f-column">
        <h5 class="basket-item-name mb-2">${volumeInfo.title}</h5>
        <p class="basket-item-author">${volumeInfo.authors[0]}</p>
      </div>
      <div class="basket-item-price d-flex f-column">
        <p class="basket-item-amount">
          ${count * saleInfo.listPrice.amount} 
          ${saleInfo.listPrice.currencyCode}
        </p>
      </div>
    </div>
  </div>`;

totalAmountFieldRef.innerHTML = `${totalBasketAmount.toFixed(
  2
)} ${currencyCode}`;

const basketContentHTML = currentBasket.map(createBasketItem).join("");
basketContent.innerHTML = basketContentHTML;

addressInputRef.addEventListener("input", (event) => {
  addressFieldRef.innerHTML = event.target.value;
});

paymentMethodInputsRef.forEach((input) =>
  input.addEventListener("click", (event) => {
    paymentMethodFieldRef.innerHTML = event.target.value;
  })
);
