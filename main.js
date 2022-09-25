let bookList = [],
  basketList = [];

const toggleModal = () => {
  const basketModal = document.querySelector(".basket--overlay");
  basketModal.classList.toggle("show");
};

const getBooks = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books));
};

getBooks();

const createItemStars = (starRate) => {
  let startRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i)
      startRateHtml += `<i class="bi bi-star-fill active"></i>`;
    else startRateHtml += `<i class="bi bi-star-fill"></i>`;
  }

  return startRateHtml;
};

const createBookItemsHtml = () => {
  const storeItem = document.querySelector(".store--card");
  let bookItemHtml = "";
  bookList.forEach((book, index) => {
    bookItemHtml += `<div class=" col-5 my-5 ${index % 2 == 0 && "offset-2"}">
        <div class="row store--card">
          <div class="col-6">
            <img
              src="${book.imgSource}"
              alt="Nutuk"
              class="img-fluid shadow"
              width="258"
              height="400"
            />
          </div>
          <div class="col-6 d-flex flex-column justify-content-between">
            <div class="card--details">
              <span class="item--creator fos gray fs-5">${book.author}</span>
              <br />
              <span class="item--name fs-6 fw-bold">${book.name}</span>
              <br />
              <span class="product--rate--star"
                >${createItemStars(book.starRate)}
                <span class="gray">${book.reviewCount}</span>
              </span>
            </div>
            <p class="product-description fos gray">${book.description}</p>
            <div>
              <span class="balck fw-bold fs-6 me-2">${book.price} AZN</span>
              
              ${
                book.oldPrice
                  ? `<span class="fs-6 fw-bold old--price">${book.oldPrice} AZN</span>`
                  : ""
              }
            </div>
            <button class="btn--purple" onclick="addItemToBasket(${
              book.id
            })">SƏBƏTƏ AT</button>
          </div>
        </div>
      </div>`;
  });
  storeItem.innerHTML = bookItemHtml;
};

// Filter hissesi obyekt
const ITEM_TYPES = {
  ALL: "Hamısı",
  NOVEL: "Roman",
  CHILDREN: "Uşaq",
  SELFIMPROVEMENT: "Şəxsi İnkişaf",
  HISTORY: "Tarix",
  FINANCE: "Maliyyə",
  SCIENCE: "Elm",
};
// Filter hissesi obyekt

// Filter ucun
const createItemTypesHtml = () => {
  const filterEl = document.querySelector(".filter");
  let filterHtml = "";

  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
      filterTypes.push(book.type);
    }
  });

  filterTypes.forEach((type, index) => {
    filterHtml += `<li class="${index == 0 ? "active" : null}
    "onclick="filterItems(this)"
    data-type="${type}">${ITEM_TYPES[type] || type}</li>`;
  });

  filterEl.innerHTML = filterHtml;
};
// Filter ucun

// Filterlemek
const filterItems = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.type;
  getBooks();
  if (bookType != "ALL")
    bookList = bookList.filter((book) => book.type == bookType);
  createBookItemsHtml();
};
// Filterlemek

const listBasketItems = () => {
  let basketListEl = document.querySelector(".basket--list");
  // Basket Count
  let basketCountEl = document.querySelector(".basket--count");
  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  // Basket Count

  // Total Price
  let totalPriceEl = document.querySelector(".total--price");
  // Total Price

  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
    basketListHtml += `            <li class="basket--item">
    <img class="item--image" src="${item.product.imgSource}" alt="Nutuk">
    <div class="item--info">
      <h3 class="item--name">${item.product.name}</h3>
      <span class="item--price">${item.product.price} AZN</span>
      </br>
      <span class="item--remove" onclick="removeBasketItem(${item.product.id})">Sil</span>
    </div>
    <div class="item--counter">
      <span class="item--decrese" onClick="decreseBasketItem(${item.product.id})">-</span>
      <span class="item--count">${item.quantity}</span>
      <span class="item--increse" onClick="increseBasketItem(${item.product.id})">+</span>
    </div>
  </li>`;
  });
  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket--item">Səbətdə məhsul yoxdur</li>`;
  totalPriceEl.innerHTML =
    totalPrice > 0 ? "Cəmi:" + " " + totalPrice.toFixed(2) + "AZN" : null;
};

// Add to cart methodu
const addItemToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId);
  if (findedBook) {
    const basketAlreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    if (basketAlreadyIndex == -1) {
      let addedItem = { quantity: 1, product: findedBook };
      basketList.push(addedItem);
    } else {
      if (
        basketList[basketAlreadyIndex].quantity <
        basketList[basketAlreadyIndex].product.stock
      ) {
        basketList[basketAlreadyIndex].quantity += 1;
      } else {
        alert("Qeyd etdiyiniz sayda məhsul stokda yoxdur !");
        return;
      }
    }
  }
  listBasketItems();
  alert("Seçdiyiniz kitab səbətə əlavə olundu.");
};

// Remove item from cart methodu
const removeBasketItem = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    basketList.splice(findedIndex, 1);
  }
  listBasketItems();
};

// Decrese and Increse basket item quantity
const decreseBasketItem = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1;
      listBasketItems();
    } else {
      removeBasketItem(bookId);
      listBasketItems();
    }
  }
};

const increseBasketItem = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (
      basketList[findedIndex].quantity < basketList[findedIndex].product.stock
    ) {
      basketList[findedIndex].quantity += 1;
      listBasketItems();
    } else {
      alert("Qeyd etdiyiniz sayda məhsul stokda yoxdur !");
      listBasketItems();
    }
  }
};

setTimeout(() => {
  createBookItemsHtml();
  createItemTypesHtml();
}, 100);
