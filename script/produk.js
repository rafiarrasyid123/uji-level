const localApi = "../Api/Motor.json";
const remoteApi = "https://dummyjson.com/products/category/motorcycle";
const CART_KEY = "motorcycle_cart";
const USD_TO_IDR = 16000;

const container = document.getElementById("container");
const productCountEl = document.getElementById("product-count");
const searchInputs = Array.from(
  document.querySelectorAll("[data-product-search]"),
);
const welcomeUser = document.getElementById("welcome-user");
const dropdownAvatarNameButton = document.getElementById(
  "dropdownAvatarNameButton",
);
const dropdownAvatarName = document.getElementById("dropdownAvatarName");
const dropdownNameButton = document.getElementById("dropdown-name-button");
const dropdownNameCard = document.getElementById("dropdown-name-card");
const dropdownUsernameCard = document.getElementById("dropdown-username-card");
const logoutLink = document.getElementById("logout-link");
const cartBadge = document.getElementById("cart-badge");

let motorcycles = [];

function isLoggedIn() {
  return Boolean(
    sessionStorage.getItem("nama") || sessionStorage.getItem("username"),
  );
}

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

function updateCartUI() {
  const count = readCart().reduce(
    (total, item) => total + Number(item.qty || 0),
    0,
  );
  if (cartBadge) {
    cartBadge.textContent = count;
    count > 0
      ? cartBadge.classList.remove("hidden")
      : cartBadge.classList.add("hidden");
  }
}

function addToCart(productId) {
  if (!isLoggedIn()) {
    alert("Harap login dulu.");
    window.location.href = "./login.html";
    return;
  }

  const product = motorcycles.find(
    (item) => Number(item.id) === Number(productId),
  );
  if (!product) return;

  const cart = readCart();
  const existing = cart.find((item) => Number(item.id) === Number(product.id));

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      brand: product.brand || "-",
      qty: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
  alert(`${product.title} telah ditambahkan ke keranjang!`);
}

function updateUserInfo() {
  const nama = sessionStorage.getItem("nama");
  const username = sessionStorage.getItem("username");
  const displayName = nama || "User";

  if (welcomeUser) welcomeUser.textContent = displayName;
  if (dropdownNameButton) dropdownNameButton.textContent = displayName;
  if (dropdownNameCard) dropdownNameCard.textContent = displayName;
  if (dropdownUsernameCard)
    dropdownUsernameCard.textContent = `@${username || "username"}`;
}

function setupDropdown() {
  if (!dropdownAvatarNameButton || !dropdownAvatarName) return;
  dropdownAvatarNameButton.onclick = (e) => {
    e.stopPropagation();
    dropdownAvatarName.classList.toggle("hidden");
  };
  document.onclick = () => dropdownAvatarName.classList.add("hidden");
}

function renderProducts(products, keyword = "") {
  if (!container) return;
  if (productCountEl) productCountEl.textContent = `${products.length} Produk`;

  if (products.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-20 text-center">
        <p class="text-slate-500 font-medium">Motor "${keyword}" tidak ditemukan.</p>
      </div>`;
    return;
  }

  container.innerHTML = products
    .map(
      (item) => `
    <div class="group relative bg-white rounded-[32px] p-2 border border-slate-100 hover:border-slate-200 transition-all duration-500 flex flex-col h-full">
      <a href="./Detail.html?id=${item.id}" class="block flex-1">
        <div class="relative overflow-hidden rounded-[26px] aspect-[4/3] bg-slate-50">
          <img 
            src="${item.thumbnail}" 
            alt="${item.title}"
            class="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700"
            onerror="this.onerror=null;this.src='https://placehold.co/400x300?text=Motor';"
          >
          <div class="absolute top-4 left-4 bg-slate-900/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-tighter">
            ${item.brand}
          </div>
        </div>
      
        <div class="px-5 py-6 flex flex-col">
          <h3 class="font-black text-slate-900 text-xl leading-tight mb-3 group-hover:text-blue-600 transition-colors">${item.title}</h3>
          <p class="text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed mb-2">
            ${item.description}
          </p>
        </div>
      </a>
        
      <div class="px-5 pb-6 mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
          <span class="text-xl font-black text-slate-900">${formatRupiahFromUsd(item.price)}</span>
          <button 
            onclick="addToCart('${item.id}')"
            class="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-slate-900 transition-all active:scale-90 shadow-lg shadow-blue-100"
            title="Add to Cart"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

function handleSearch(e) {
  const value = e.target.value.toLowerCase();
  searchInputs.forEach((input) => (input.value = e.target.value));
  const filtered = motorcycles.filter(
    (m) =>
      m.title.toLowerCase().includes(value) ||
      m.brand.toLowerCase().includes(value) ||
      m.description.toLowerCase().includes(value),
  );
  renderProducts(filtered, value);
}

async function init() {
  updateUserInfo();
  updateCartUI();
  setupDropdown();

  logoutLink?.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    window.location.replace("../index.html");
  });

  searchInputs.forEach((input) =>
    input.addEventListener("input", handleSearch),
  );

  try {
    const [localRes, remoteRes] = await Promise.allSettled([
      fetch(localApi),
      fetch(remoteApi),
    ]);

    const localData =
      localRes.status === "fulfilled" && localRes.value.ok
        ? await localRes.value.json()
        : { motorcycles: [] };
    const remoteData =
      remoteRes.status === "fulfilled" && remoteRes.value.ok
        ? await remoteRes.value.json()
        : { products: [] };

    const normalizedLocal = (localData.motorcycles || []).map((m) => ({
      id: m.id,
      title: m.model || m.title,
      description: m.description,
      price: typeof m.price === "number" ? Math.round(m.price / USD_TO_IDR) : 0,
      thumbnail:
        m.images?.[0] || m.image || "https://placehold.co/400x300?text=Motor",
      brand: m.brand,
    }));

    const normalizedRemote = (remoteData.products || []).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      thumbnail: p.thumbnail,
      brand: p.brand,
    }));

    motorcycles = [...normalizedLocal];
    normalizedRemote.forEach((rm) => {
      if (!motorcycles.find((lm) => Number(lm.id) === Number(rm.id))) {
        motorcycles.push(rm);
      }
    });

    renderProducts(motorcycles);
  } catch (error) {
    console.error("Gagal memuat data:", error);
  }
}

window.addToCart = addToCart;
document.addEventListener("DOMContentLoaded", init);
