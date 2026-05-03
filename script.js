let products = [
  { id: 1, name: 'Sports Shoes', price: 2499, stock: 10, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
  { id: 2, name: 'Smart Watch', price: 3999, stock: 8, img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d' },
  { id: 3, name: 'Headphones', price: 1999, stock: 12, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
  { id: 4, name: 'Backpack', price: 1599, stock: 7, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62' },
  { id: 5, name: 'T-Shirt', price: 799, stock: 20, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
  { id: 6, name: 'Sunglasses', price: 1299, stock: 15, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083' },
  { id: 7, name: 'Laptop Bag', price: 1899, stock: 9, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
  { id: 8, name: 'Bluetooth Speaker', price: 2499, stock: 11, img: 'https://images.unsplash.com/photo-1518441314328-4f3a6b8f1f4a' },
  { id: 9, name: 'Running Socks', price: 499, stock: 30, img: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82' },
  { id: 10, name: 'Cap', price: 599, stock: 25, img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee' }
];

let cart = [];
let orders = [];

const APP_PASSWORD = "1234";

/* Real login system */
let users = JSON.parse(localStorage.getItem("shopUsers") || "[]");
let currentUser = JSON.parse(localStorage.getItem("shopCurrentUser") || "null");

function saveUsers() {
  localStorage.setItem("shopUsers", JSON.stringify(users));
}

function saveCurrentUser() {
  localStorage.setItem("shopCurrentUser", JSON.stringify(currentUser));
}

function showUser() {
  const userInfo = document.getElementById("userInfo");
  if (!userInfo) return;

  if (currentUser && currentUser.name) {
    userInfo.innerText = "👤 Welcome, " + currentUser.name;
  } else {
    userInfo.innerText = "";
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "shopTheme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
}

/* ---------------- PASSWORD SCREEN ---------------- */

function unlockSite() {
  const pass = document.getElementById("sitePassword").value;

  if (pass === APP_PASSWORD) {
    localStorage.setItem("shopUnlocked", "yes");

    const startScreen = document.getElementById("startScreen");
    const mainApp = document.getElementById("mainApp");

    if (startScreen) startScreen.style.display = "none";
    if (mainApp) mainApp.style.display = "block";

    renderProducts();
    renderCart();
    renderOrders();
    renderDatabase();
    updateStats();
    showUser();
  } else {
    const msg = document.getElementById("startMsg");
    if (msg) msg.innerText = "Wrong password!";
  }
}

/* ---------------- PRODUCTS ---------------- */

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const q = (document.getElementById('search')?.value || '').toLowerCase();
  const filter = document.getElementById('filterStock')?.value || 'all';

  grid.innerHTML = '';

  products.forEach(p => {
    const matchSearch = p.name.toLowerCase().includes(q);
    const matchFilter =
      filter === 'all' ||
      (filter === 'instock' && p.stock > 0) ||
      (filter === 'lowstock' && p.stock > 0 && p.stock <= 5);

    if (matchSearch && matchFilter) {
      grid.innerHTML += `
        <div class="card">
          <img src="${p.img}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">₹${p.price}</p>
          <p>Stock: ${p.stock}</p>
          <button class="primary" onclick="addToCart(${p.id})">Add</button>
        </div>
      `;
    }
  });

  renderDatabase();
  updateStats();
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const f = cart.find(x => x.id === id);

  if (f) {
    if (f.qty < p.stock) {
      f.qty++;
    } else {
      alert("Stock limit reached!");
      return;
    }
  } else {
    cart.push({ ...p, qty: 1 });
  }

  renderCart();
}

function renderCart() {
  const div = document.getElementById('cartItems');
  if (!div) return;

  div.innerHTML = '';
  let total = 0;
  let itemCount = 0;

  if (cart.length === 0) {
    div.innerHTML = 'Cart empty';
  } else {
    cart.forEach(i => {
      total += i.price * i.qty;
      itemCount += i.qty;

      div.innerHTML += `
        <div class="order-item">
          <div>
            <strong>${i.name}</strong><br>
            ₹${i.price} x ${i.qty}
          </div>
          <div>
            <button class="soft" onclick="changeQty(${i.id}, -1)">-</button>
            <button class="soft" onclick="changeQty(${i.id}, 1)">+</button>
          </div>
        </div>
      `;
    });
  }

  const totalEl = document.getElementById('total');
  const itemCountEl = document.getElementById('itemCount');

  if (totalEl) totalEl.innerText = total;
  if (itemCountEl) itemCountEl.innerText = itemCount;
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  renderCart();
}

/* ---------------- CHECKOUT / ORDERS ---------------- */

function placeOrder() {
  const name = document.getElementById('custName').value.trim();

  if (!name) {
    document.getElementById('orderMsg').innerText = 'Enter name';
    return;
  }

  if (cart.length === 0) {
    document.getElementById('orderMsg').innerText = 'Cart empty';
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const items = cart.map(i => `${i.name} x ${i.qty}`).join(', ');

  orders.unshift({
    id: orders.length + 1,
    name,
    total,
    items
  });

  cart = [];
  renderCart();
  renderOrders();
  updateStats();

  document.getElementById('orderMsg').innerText = 'Order placed!';
}

function renderOrders() {
  const box = document.getElementById('ordersList');
  if (!box) return;

  if (orders.length === 0) {
    box.innerHTML = 'No orders yet.';
    return;
  }

  box.innerHTML = orders.map(o => `
    <div class="section" style="margin-top:12px">
      <strong>Order #${o.id}</strong><br>
      ${o.name}<br>
      ₹${o.total}<br>
      ${o.items}
    </div>
  `).join('');
}

/* ---------------- DATABASE LOOK ---------------- */

function renderDatabase() {
  const tbody = document.getElementById('dbRows');
  if (!tbody) return;

  tbody.innerHTML = products.map(p => {
    let status = 'In Stock';
    let cls = 'success';

    if (p.stock <= 5 && p.stock > 0) {
      status = 'Low Stock';
      cls = 'warning';
    } else if (p.stock === 0) {
      status = 'Out of Stock';
      cls = 'info';
    }

    return `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>₹${p.price}</td>
        <td>${p.stock}</td>
        <td><span class="pill ${cls}">${status}</span></td>
      </tr>
    `;
  }).join('');
}

/* ---------------- ADMIN ---------------- */

function updateStats() {
  const productCount = document.getElementById('productCount');
  const orderCount = document.getElementById('orderCount');
  const revenue = document.getElementById('revenue');

  if (productCount) productCount.innerText = products.length;
  if (orderCount) orderCount.innerText = orders.length;

  if (revenue) {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    revenue.innerText = `₹${totalRevenue}`;
  }
}

function addProduct() {
  const name = document.getElementById('adminName').value.trim();
  const price = parseInt(document.getElementById('adminPrice').value);
  const stock = parseInt(document.getElementById('adminStock').value);

  if (!name || isNaN(price) || isNaN(stock)) {
    alert('Please fill all product fields correctly');
    return;
  }

  const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;

  products.push({
    id: newId,
    name,
    price,
    stock,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b7f6c5d'
  });

  document.getElementById('adminName').value = '';
  document.getElementById('adminPrice').value = '';
  document.getElementById('adminStock').value = '';

  renderProducts();
  renderDatabase();
  updateStats();
}

/* ---------------- LOGIN / SIGNUP MODALS ---------------- */

function openLogin() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'flex';
}

function closeLogin() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'none';
}

function openSignup() {
  const modal = document.getElementById('signupModal');
  if (modal) modal.style.display = 'flex';
}

function closeSignup() {
  const modal = document.getElementById('signupModal');
  if (modal) modal.style.display = 'none';
}

function signup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const pass = document.getElementById("signupPass").value;

  if (!name || !email || !pass) {
    document.getElementById("signupMsg").innerText = "Please fill all fields";
    return;
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    document.getElementById("signupMsg").innerText = "Email already exists";
    return;
  }

  const newUser = { name, email, pass };
  users.push(newUser);
  saveUsers();

  currentUser = { name, email };
  saveCurrentUser();

  document.getElementById("signupMsg").innerText = "Account created successfully";
  closeSignup();
  showUser();
}

function login() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const pass = document.getElementById("loginPass").value;

  const user = users.find(u => u.email === email && u.pass === pass);

  if (!user) {
    document.getElementById("loginMsg").innerText = "Invalid email or password";
    return;
  }

  currentUser = { name: user.name, email: user.email };
  saveCurrentUser();

  document.getElementById("loginMsg").innerText = "Login successful";
  closeLogin();
  showUser();
}

function logout() {
  currentUser = null;
  localStorage.removeItem("shopCurrentUser");
  localStorage.removeItem("shopUnlocked");

  const mainApp = document.getElementById("mainApp");
  const startScreen = document.getElementById("startScreen");
  const sitePassword = document.getElementById("sitePassword");
  const startMsg = document.getElementById("startMsg");

  if (mainApp) mainApp.style.display = "none";
  if (startScreen) startScreen.style.display = "flex";
  if (sitePassword) sitePassword.value = "";
  if (startMsg) startMsg.innerText = "";

  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const paymentModal = document.getElementById("paymentModal");

  if (loginModal) loginModal.style.display = "none";
  if (signupModal) signupModal.style.display = "none";
  if (paymentModal) paymentModal.style.display = "none";

  document.body.classList.remove("dark-mode");
  localStorage.setItem("shopTheme", "light");
  showUser();
}

/* ---------------- PAYMENT ---------------- */

function togglePaymentFields() {
  const method = document.getElementById('paymentMethod').value;
  const upiBox = document.getElementById('upiBox');
  const cardBox = document.getElementById('cardBox');
  const netBankingBox = document.getElementById('netBankingBox');

  if (upiBox) upiBox.style.display = method === 'upi' ? 'block' : 'none';
  if (cardBox) cardBox.style.display = method === 'card' ? 'block' : 'none';
  if (netBankingBox) netBankingBox.style.display = method === 'netbanking' ? 'block' : 'none';
}

function confirmPayment() {
  const msg = document.getElementById('paymentMsg');
  if (msg) msg.innerText = 'Payment successful (demo)';
}

function closePayment() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.style.display = 'none';
}

/* ---------------- PAGE INIT ---------------- */

window.addEventListener("load", function () {
  const start = document.getElementById("startScreen");
  const main = document.getElementById("mainApp");

  const savedTheme = localStorage.getItem("shopTheme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  if (localStorage.getItem("shopUnlocked") === "yes") {
    if (start) start.style.display = "none";
    if (main) main.style.display = "block";

    renderProducts();
    renderCart();
    renderOrders();
    renderDatabase();
    updateStats();
    showUser();
  } else {
    if (start) start.style.display = "flex";
    if (main) main.style.display = "none";
    showUser();
  }
});