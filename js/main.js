import { Products } from "./data.js";
import { storage } from "./helpers.js";
import Modal from "./modal.js";

/** Product card references */
const productsRef = document.getElementById("products");
const productCardsRef = document.getElementsByClassName("product-card");

/** Basket references */
const basketRef = document.getElementById("basket");
const basketContent = document.querySelector(".basket-items");
const basketOpenButtonRef = document.getElementById("basket-open-button");
const basketCloseButtonRef = document.getElementById("basket-close-button");

/** Cart button references */
let addToCartButtonsRef;
let removeCartsButtonRef;

/** New product button */
const newProductButtonRef = document.querySelector(
  "[data-role='new-product-button']"
);
let imageUploadButtonRef;
let addNewProductButtonRef;
let newProductInfo = {
  volumeInfo: {
    title: "",
    authors: [],
    description: "",
    imageLinks: {
      smallThumbnail: "",
    },
  },
  saleInfo: {
    listPrice: {
      amount: 0,
      currencyCode: "TRY",
    },
  },
};

/** Search references */
const searchInputRef = document.querySelector("[data-role='search-input']");
const searchResultAreaRef = document.querySelector(
  "[data-role='search-results']"
);

let totalBasketAmount = Number(storage.get("basketAmount")) || 0;
let currentBasket = storage.get("basket") || [];

const addNewProduct = () => {
  newProductInfo = {
    ...newProductInfo,
    id: `${Math.floor(Math.random() * 100)}`,
  };

  Products.items = [newProductInfo, ...Products.items];
  renderProducts();
  Modal.close();
};

const loadFile = (event) => {
  const reader = new FileReader();

  reader.onload = () => {
    const output = document.getElementById("new-product-image");
    output.src = reader.result;
    newProductInfo.volumeInfo.imageLinks.smallThumbnail = reader.result;
  };

  reader.readAsDataURL(event.target.files[0]);
};

const openNewProductModal = () => {
  Modal.open(`
    <div class="new-product">
      <div class="d-flex">
        <div class="new-product-image">
          <input type="file" accept="image/*" data-role="image-upload">
          <img id="new-product-image"/>
        </div>
        <div class="d-flex f-column">
          <input id="new-product-name" type="text" class="input" placeholder="Enter the book name..." />
          <input id="new-product-author" type="text" class="input" placeholder="Enter the book author name..." />
          <textarea id="new-product-description" class="input" placeholder="Enter the book description..."></textarea>
          <input id="new-product-price" type="number" class="input" placeholder="Enter the price..." />
        </div>
      </div>
      <button id="add-new-product" class="button button-primary">Add to List</button>
    </div>
  `);
  imageUploadButtonRef = document.querySelector("[data-role='image-upload']");
  imageUploadButtonRef.addEventListener("change", loadFile);

  addNewProductButtonRef = document.querySelector("#add-new-product");
  addNewProductButtonRef.addEventListener("click", addNewProduct);

  document
    .querySelector("#new-product-name")
    .addEventListener(
      "input",
      (e) => (newProductInfo.volumeInfo.title = e.target.value)
    );

  document
    .querySelector("#new-product-author")
    .addEventListener(
      "input",
      (e) => (newProductInfo.volumeInfo.authors = [e.target.value])
    );

  document
    .querySelector("#new-product-price")
    .addEventListener(
      "input",
      (e) => (newProductInfo.saleInfo.listPrice.amount = Number(e.target.value))
    );

  document
    .querySelector("#new-product-description")
    .addEventListener(
      "input",
      (e) => (newProductInfo.volumeInfo.description = e.target.value)
    );
};

/** Binding event helpers */
const bindAddBasketItemEvent = (ref) =>
  ref.addEventListener("click", addToBasket);
const bindRemoveBasketItemEvent = (ref) =>
  ref.addEventListener("click", removeFromBasket);

const findProductById = (id) =>
  Products.items.find((product) => product.id === id);

const createProductModal = ({ id, volumeInfo, saleInfo }) => {
  Modal.open(`
    <div class="modal-product-image d-flex align-center">
        <img
          alt=${volumeInfo.title}
          width="250px"
          src=${volumeInfo.imageLinks.smallThumbnail}
        />
      </div>
      <div class="modal-product-info">
        <h4 class="product-name">${volumeInfo.title}</h4>
        <p class="product-author">
          <i class="fas fa-pencil-alt"></i>
          ${volumeInfo.authors[0]}
        </p>
        <p class="product-description">
          ${volumeInfo.description}
        </p>
        <div class="add-to-cart">
          <h3 class="price mb-3">
            ${saleInfo.listPrice.amount.toFixed(2)} 
            ${saleInfo.listPrice.currencyCode}
          </h3>
          <button
            class="button button-secondary mr-3"
            data-role="add-button"
            data-product-id=${id}
            >
            Add To Cart
          </button>
        </div>
      </div>
    `);
};

const openProductModal = ({ dataset }) => () => {
  /** Get the active product item information */
  const { volumeInfo, saleInfo } = findProductById(dataset.productId);

  createProductModal({ id: dataset.productId, volumeInfo, saleInfo });
  addToCartButtonsRef = document.querySelectorAll("[data-role='add-button']");
  addToCartButtonsRef.forEach(bindAddBasketItemEvent);
};

const bindOpenModalEvent = async (productRef) => {
  await productRef.addEventListener("click", openProductModal(productRef));
  addToCartButtonsRef.forEach(bindAddBasketItemEvent);
};

const createProductCard = ({ id, volumeInfo, saleInfo }) => `
  <div class="product-card d-flex f-column" data-product-id=${id} >
    <div class="product-card-image d-flex">
      <img src=${volumeInfo.imageLinks.smallThumbnail} alt=${volumeInfo.title} width="100%" />
    </div>
    <div class="product-card-body">
      <h4 class="product-name">${volumeInfo.title}</h4>
      <p class="product-info">${volumeInfo.authors[0]}</p>
    </div>
    <div
      class="product-card-footer d-flex justify-between align-center"
    >
      <div class="price d-flex align-end">
        <p class="price-amount mr-2">${saleInfo.listPrice.amount}</p>
        <p class="price-currency">${saleInfo.listPrice.currencyCode}</p>
      </div>
      <div class="add-to-cart d-flex">
        <button 
          class="button button-secondary add-to-cart-button" 
          data-product-id=${id}
          data-role="add-button"
          >
          <i class="fas fa-cart-plus" data-product-id=${id}></i>
          Add
        </button>
      </div>
    </div>
  </div>`;

const renderProducts = () => {
  productsRef.innerHTML = Products.items.map(createProductCard).join("");

  addToCartButtonsRef = [
    ...document.querySelectorAll("[data-role='add-button']"),
  ];

  [...productCardsRef].forEach(bindOpenModalEvent);
};

const addToBasket = (event) => {
  event.stopPropagation();

  basketOpenButtonRef.classList.add("glowing");
  setTimeout(() => {
    basketOpenButtonRef.classList.remove("glowing");
  }, 500);

  const productId = event.target.dataset.productId;
  const { volumeInfo, saleInfo } = findProductById(productId);
  totalBasketAmount += saleInfo.listPrice.amount;

  const activeBasketItem = currentBasket.some((i) => i.id === productId);

  if (!activeBasketItem) {
    currentBasket = [
      ...currentBasket,
      { volumeInfo, saleInfo, id: productId, count: 1 },
    ];
  } else {
    currentBasket.find((i) => i.id === productId).count++;
  }

  storage.set("basket", currentBasket);
  renderBasketContent();
};

const removeFromBasket = (event) => {
  event.stopPropagation();
  const productId = event.target.dataset.productId;

  const activeBasketItem = currentBasket.find((i) => i.id === productId);
  totalBasketAmount -= activeBasketItem.saleInfo.listPrice.amount || 0;

  if (activeBasketItem) {
    const activeCount = activeBasketItem.count--;

    if (activeCount <= 1) {
      currentBasket = currentBasket.filter((i) => i.id !== productId);
    }

    storage.set("basket", currentBasket);
    renderBasketContent();
  }
};

const createBasketItem = ({ id, count, volumeInfo, saleInfo }) =>
  `
  <div class="basket-item d-flex align-center">
    <div class="basket-item-image">
      <img
        src=${volumeInfo.imageLinks.smallThumbnail}
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
        <div class="basket-item-count d-flex align-center">
          <button
            class="button count-remove d-flex align-center justify-center"
            data-product-id=${id}
            >
            -
          </button>
          <p class="count-number d-flex align-center justify-center">${count}</p>
          <button
            class="button count-add d-flex align-center justify-center"
            data-product-id=${id}
            >
            +
          </button>
        </div>
        <p class="basket-item-amount">
          ${count * saleInfo.listPrice.amount} 
          ${saleInfo.listPrice.currencyCode}
        </p>
      </div>
    </div>
  </div>`;

const renderBasketContent = () => {
  currentBasket = storage.get("basket") || [];
  storage.set("basketAmount", totalBasketAmount);

  if (!!currentBasket.length) {
    let basketItemHTML = currentBasket.map(createBasketItem).join("");

    basketItemHTML = `${basketItemHTML}
      <div class="basket-footer d-flex justify-between align-center">
        <p class="total">Total Amount:<br/><span>${totalBasketAmount.toFixed(
          2
        )} TRY</span></p>
        <a class="button button-transparent" style="text-decoration: underline" 
          href="#products"
          data-role="continue-shopping">Continue Shopping</a>
        <a class="button button-primary" href="./checkout.html">Go Checkout</a>
      </div>`;

    basketContent.innerHTML = basketItemHTML;

    document
      .querySelector("[data-role='continue-shopping']")
      .addEventListener("click", closeBasket);

    const addToBasketButtonsRef = [...document.querySelectorAll(".count-add")];
    const removeFromBasketButtonsRef = [
      ...document.querySelectorAll(".count-remove"),
    ];

    addToBasketButtonsRef.forEach(bindAddBasketItemEvent);
    removeFromBasketButtonsRef.forEach(bindRemoveBasketItemEvent);
  } else {
    storage.set("basketAmount", 0);
    basketContent.innerHTML = `
      <div class="basket-empty d-flex f-column align-center justify-center">
        <div class="empty-icon">
          <i class="fas fa-book"></i>
        </div>
        <h3 class="empty-text">Currently, your basket is empty</h3>
      </div>
    `;
  }
};

const openBasket = () => {
  renderBasketContent();
  basketRef.style.width = "420px";

  removeCartsButtonRef = [
    ...document.getElementsByClassName("remove-from-cart-button"),
  ];

  removeCartsButtonRef.forEach(bindRemoveBasketItemEvent);
};

const closeBasket = () => {
  basketRef.style.width = 0;
};

const renderSearchProductItem = ({ id, volumeInfo, saleInfo }) => `
  <div class="search-result-item">
    <button 
      class="button button-transparent d-flex align-center"
      data-role="open-modal"
      data-product-id=${id}
      >
      <div class="result-image">
        <img
          src=${volumeInfo.imageLinks.smallThumbnail}
          alt=${volumeInfo.title}
          width="48px"
        />
      </div>
      <div class="result-info d-flex align-start f-column">
        <h3 class="result-name">${volumeInfo.title}</h3>
        <p class="result-author">${volumeInfo.authors[0]}</p>
      </div>
      <div class="result-price">
        <p class="result-price-amount">
          ${saleInfo.listPrice.amount.toFixed(2)} 
          ${saleInfo.listPrice.currencyCode}
        </p>
      </div>
    </button>
  </div>
`;

const clearSearchResults = () => (searchResultAreaRef.innerHTML = "");

const checkIsOutsideFromSearch = (event) => {
  if (!event.target.closest(".hero-search")) {
    clearSearchResults({});
    document.removeEventListener("click", checkIsOutsideFromSearch);
  }
};

const searchProduct = (e) => {
  e.stopPropagation();
  const searchKey = e.target.value.toLowerCase();

  const result = Products.items.filter(({ volumeInfo }) =>
    volumeInfo.title.toLowerCase().includes(searchKey)
  );

  if (searchKey.length > 2) {
    if (!result.length) {
      searchResultAreaRef.innerHTML = `<h5 class="d-flex align-center justify-center" style="height: 56px">No Result</h5>`;
    } else {
      const resultHTML = result.map(renderSearchProductItem).join("");
      searchResultAreaRef.innerHTML = resultHTML;

      const modalOpenButtonsRef = document.querySelectorAll(
        "[data-role='open-modal']"
      );
      modalOpenButtonsRef.forEach(bindOpenModalEvent);
    }
  } else {
    clearSearchResults({});
  }
};

const bindOutsideClickHandler = (event) => {
  searchProduct(event);
  document.addEventListener("click", checkIsOutsideFromSearch);
};

/** Basket events registrations */
basketOpenButtonRef.addEventListener("click", openBasket);
basketCloseButtonRef.addEventListener("click", closeBasket);

/** Search events registrations */
searchInputRef.addEventListener("input", searchProduct);
searchInputRef.addEventListener("focus", bindOutsideClickHandler);

newProductButtonRef.addEventListener("click", openNewProductModal);

renderProducts();
