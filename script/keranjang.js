const CART_KEY = "motorcycle_cart";
const USD_TO_IDR = 16000;
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");
const subtotalDisplay = document.getElementById("subtotal-display");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-btn");

function formatRupiahFromUsd(usdValue) {
  const idrValue = Number(usdValue || 0) * USD_TO_IDR;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(idrValue);
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateQuantity(id, delta) {
  let cart = readCart();
  const item = cart.find((i) => Number(i.id) === Number(id));
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    renderCart();
  }
}

function removeItem(id) {
  let cart = readCart();
  cart = cart.filter((i) => Number(i.id) !== Number(id));
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = readCart();
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="bg-white rounded-[40px] p-20 border border-slate-100 text-center">
        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <h3 class="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-2">Keranjang Kosong</h3>
        <p class="text-slate-400 font-medium mb-8">Sepertinya Anda belum memilih motor impian.</p>
        <a href="./produk.html" class="inline-block px-10 py-4 bg-blue-600 text-white font-black rounded-full hover:bg-slate-900 transition-all uppercase tracking-widest text-xs">Mulai Belanja</a>
      </div>
    `;
    cartTotalDisplay.textContent = "Rp 0";
    subtotalDisplay.textContent = "Rp 0";
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");

  let total = 0;
  cartItemsContainer.innerHTML = cart
    .map((item) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      return `
      <div class="bg-white rounded-[40px] p-6 border border-slate-100 flex flex-col sm:flex-row items-center gap-8 group transition-all hover:border-blue-100">
        <div class="w-full sm:w-48 aspect-video bg-slate-50 rounded-[32px] p-4 flex items-center justify-center overflow-hidden">
          <img src="${item.thumbnail}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt="${item.title}">
        </div>
        <div class="flex-1 text-center sm:text-left">
          <div class="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">${item.brand}</div>
          <h3 class="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-1">${item.title}</h3>
          <div class="text-lg font-black text-slate-400 tracking-tighter">${formatRupiahFromUsd(item.price)}</div>
        </div>
        <div class="flex items-center gap-4 bg-slate-50 p-2 rounded-full">
          <button onclick="updateQuantity(${item.id}, -1)" class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-slate-900 hover:text-white transition-all text-xl font-bold">-</button>
          <span class="font-black text-slate-900 w-6 text-center">${item.qty}</span>
          <button onclick="updateQuantity(${item.id}, 1)" class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-slate-900 hover:text-white transition-all text-xl font-bold">+</button>
        </div>
        <button onclick="removeItem(${item.id})" class="p-4 text-slate-300 hover:text-red-500 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    `;
    })
    .join("");

  cartTotalDisplay.textContent = formatRupiahFromUsd(total);
  subtotalDisplay.textContent = formatRupiahFromUsd(total);
}

function isLoggedIn() {
  return Boolean(
    sessionStorage.getItem("nama") || sessionStorage.getItem("username"),
  );
}

clearCartBtn?.addEventListener("click", () => {
  if (confirm("Kosongkan semua item di keranjang?")) {
    localStorage.removeItem(CART_KEY);
    renderCart();
  }
});

checkoutBtn?.addEventListener("click", () => {
  const paymentMethod = document.querySelector(
    'input[name="payment-method"]:checked',
  )?.value;
  alert(
    `Terima kasih! Pesanan Anda dengan metode ${paymentMethod} sedang diproses.`,
  );
  localStorage.removeItem(CART_KEY);
  window.location.href = "./produk.html";
});

window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

document.addEventListener("DOMContentLoaded", renderCart);
