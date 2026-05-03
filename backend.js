/* ================= EXTRA FEATURES FILE ================= */

/* ---------- DARK MODE ---------- */

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("darkMode", "on");
  } else {
    localStorage.setItem("darkMode", "off");
  }
}

/* Load saved dark mode */
window.addEventListener("load", () => {
  if (localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark");
  }
});


/* ---------- SAVE PRODUCTS (ADMIN) ---------- */

function saveProductsToStorage() {
  localStorage.setItem("shopProducts", JSON.stringify(products));
}

function loadProductsFromStorage() {
  const data = localStorage.getItem("shopProducts");
  if (data) {
    products = JSON.parse(data);
  }
}

loadProductsFromStorage();


/* Hook into existing addProduct */
const oldAddProduct = addProduct;
addProduct = function () {
  oldAddProduct();
  saveProductsToStorage();
};


/* ---------- DELETE PRODUCT (ADMIN POWER) ---------- */

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  saveProductsToStorage();
  renderProducts();
  renderDatabase();
  updateStats();
}

/* Add delete button in DB table */
const oldRenderDatabase = renderDatabase;
renderDatabase = function () {
  oldRenderDatabase();

  const tbody = document.getElementById("dbRows");
  if (!tbody) return;

  let rows = "";

  products.forEach(p => {
    rows += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>₹${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick="deleteProduct(${p.id})" style="background:red;color:#fff;border:none;padding:5px 8px;border-radius:6px;cursor:pointer;">
            Delete
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = rows;
};


/* ---------- CART SAVE ---------- */

function saveCart() {
  localStorage.setItem("shopCart", JSON.stringify(cart));
}

function loadCart() {
  const data = localStorage.getItem("shopCart");
  if (data) {
    cart = JSON.parse(data);
  }
}

loadCart();

/* Hook cart */
const oldAddToCart = addToCart;
addToCart = function (id) {
  oldAddToCart(id);
  saveCart();
};

const oldChangeQty = changeQty;
changeQty = function (id, delta) {
  oldChangeQty(id, delta);
  saveCart();
};


/* ---------- ORDER SAVE ---------- */

function saveOrders() {
  localStorage.setItem("shopOrders", JSON.stringify(orders));
}

function loadOrders() {
  const data = localStorage.getItem("shopOrders");
  if (data) {
    orders = JSON.parse(data);
  }
}

loadOrders();

const oldPlaceOrder = placeOrder;
placeOrder = function () {
  oldPlaceOrder();
  saveOrders();
};


/* ---------- TOAST MESSAGE ---------- */

function showToast(msg) {
  const toast = document.createElement("div");
  toast.innerText = msg;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#111";
  toast.style.color = "#fff";
  toast.style.padding = "10px 15px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

/* Hook toast */
const oldLogin = login;
login = function () {
  oldLogin();
  showToast("Login successful");
};

const oldSignup = signup;
signup = function () {
  oldSignup();
  showToast("Account created");
};


/* ---------- WELCOME BANNER ---------- */

function showWelcomeBanner() {
  if (!currentUser) return;

  const banner = document.createElement("div");
  banner.innerText = `Welcome ${currentUser.name} 🎉`;

  banner.style.position = "fixed";
  banner.style.top = "10px";
  banner.style.right = "10px";
  banner.style.background = "#22c55e";
  banner.style.color = "#fff";
  banner.style.padding = "10px 15px";
  banner.style.borderRadius = "10px";
  banner.style.zIndex = "9999";

  document.body.appendChild(banner);

  setTimeout(() => banner.remove(), 3000);
}

window.addEventListener("load", showWelcomeBanner);


/* ---------- SPECIAL OFFER ---------- */

window.addEventListener("load", () => {
  const offer = document.createElement("div");
  offer.innerText = "🔥 Special Offer: 20% OFF Today!";

  offer.style.background = "#f59e0b";
  offer.style.color = "#fff";
  offer.style.textAlign = "center";
  offer.style.padding = "10px";
  offer.style.fontWeight = "bold";

  document.body.prepend(offer);
});