const CART_KEY = "motorcycle_cart";
const USD_TO_IDR = 16000;
const detailContainer = document.getElementById("detail-container");
const cartLink = document.getElementById("cart-link");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const localApi = "../Api/Motor.json";
const remoteApiBase = "https://dummyjson.com/products";

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

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartLinkCount() {
  if (!cartLink) return;
  const count = readCart().reduce(
    (total, item) => total + Number(item.qty || 0),
    0,
  );
  cartLink.textContent = count > 0 ? `Keranjang (${count})` : "Keranjang";
}

function addToCart(product) {
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

  writeCart(cart);
  updateCartLinkCount();
  alert(`${product.title} ditambahkan ke keranjang.`);
}

function renderError(message) {
  if (!detailContainer) return;
  detailContainer.innerHTML = `<p class="text-black">${message}</p>`;
}

function renderDetail(product) {
  if (!detailContainer) return;

  const discountedPrice =
    Number(product.price) * (1 - Number(product.discountPercentage || 0) / 100);

  const ratingStars = Array.from({ length: 5 }, (_, i) => {
    const isFilled = i < Math.floor(product.rating || 0);
    return `<svg class="w-5 h-5 ${isFilled ? "text-yellow-400" : "text-slate-200"}" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>`;
  }).join("");

  detailContainer.innerHTML = `
    <div class="bg-white rounded-[60px] overflow-hidden border border-slate-100 shadow-2xl shadow-blue-900/5">
      <div class="flex flex-col lg:flex-row">
        <div class="flex-1 bg-slate-50 p-12 lg:p-20 flex items-center justify-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <img 
            src="${product.thumbnail}" 
            class="w-full max-w-lg drop-shadow-[0_45px_45px_rgba(0,0,0,0.12)] relative z-10 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2" 
            alt="${product.title}"
            onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Motor';"
          >
        </div>
        <div class="flex-1 p-10 lg:p-24 border-l border-slate-50">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter mb-8 border border-blue-100 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            ${product.brand}
          </div>
          
          <h1 class="text-5xl lg:text-8xl font-black text-slate-950 leading-tight tracking-tighter mb-10 italic">
            ${product.title.toUpperCase()}
          </h1>
          
          <div class="flex flex-wrap items-center gap-8 mb-14">
            <div>
              <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Premium Price</div>
              <div class="text-5xl font-black text-blue-600 tracking-tighter italic">${formatRupiahFromUsd(discountedPrice)}</div>
            </div>
            <div class="h-12 w-[1px] bg-slate-100 hidden sm:block"></div>
            <div>
              <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User Rating</div>
              <div class="flex items-center gap-1.5">${ratingStars}</div>
            </div>
          </div>

          <p class="text-slate-500 text-xl leading-relaxed mb-14 max-w-md font-medium tracking-tight">
            ${product.description}
          </p>
          
          <div class="grid grid-cols-2 gap-6 mb-14">
            <div class="p-8 bg-slate-50 rounded-[40px] border border-slate-100 transition-all hover:bg-white hover:border-blue-200 group/item">
              <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover/item:text-blue-600 transition-colors">Available</div>
              <div class="text-2xl font-black text-slate-950">${product.stock} <span class="text-xs">UNITS</span></div>
            </div>
            <div class="p-8 bg-slate-50 rounded-[40px] border border-slate-100 transition-all hover:bg-white hover:border-blue-200 group/item">
              <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover/item:text-blue-600 transition-colors">Edition</div>
              <div class="text-2xl font-black text-slate-950">${product.category.toUpperCase()}</div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-5">
            <button 
              id="add-cart-btn" 
              class="flex-[2] px-12 py-7 bg-slate-950 text-white font-black rounded-full hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 uppercase tracking-widest text-xs active:scale-95"
            >
              Reservasi Sekarang
            </button>
            <a 
              href="./keranjang.html" 
              class="flex-1 px-12 py-7 bg-white text-slate-950 font-black rounded-full hover:bg-slate-50 transition-all text-center uppercase tracking-widest text-xs active:scale-95 border-2 border-slate-100 shadow-sm"
            >
              Keranjang
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  const addButton = document.getElementById("add-cart-btn");
  addButton?.addEventListener("click", () => addToCart(product));
}

if (!productId) {
  renderError("ID produk tidak ditemukan di URL.");
} else {
  Promise.allSettled([fetch(localApi), fetch(`${remoteApiBase}/${productId}`)])
    .then(async (results) => {
      const localResult = results[0];
      const remoteResult = results[1];

      const localData =
        localResult.status === "fulfilled" && localResult.value.ok
          ? await localResult.value.json()
          : null;
      const remoteData =
        remoteResult.status === "fulfilled" && remoteResult.value.ok
          ? await remoteResult.value.json()
          : null;

      const localItems = Array.isArray(localData?.motorcycles)
        ? localData.motorcycles.map((m) => ({
            id: m.id,
            title: m.model || m.title || `Motor ${m.id}`,
            description: m.description || "",
            price:
              typeof m.price === "number"
                ? Math.round(m.price / USD_TO_IDR)
                : Number(m.price)
                  ? Math.round(Number(m.price) / USD_TO_IDR)
                  : 0,
            thumbnail:
              Array.isArray(m.images) && m.images.length
                ? m.images[0]
                : m.image ||
                  m.images?.[0] ||
                  "https://placehold.co/400x250?text=Produk",
            images:
              Array.isArray(m.images) && m.images.length
                ? m.images
                : m.image
                  ? [m.image]
                  : [],
            brand: m.brand || "-",
            category: m.category || "-",
            stock: m.stock ?? "-",
            rating: m.rating ?? "-",
            discountPercentage: m.discountPercentage ?? 0,
          }))
        : [];

      const remoteItem =
        remoteData && remoteData.id
          ? {
              id: remoteData.id,
              title: remoteData.title || `Motor ${remoteData.id}`,
              description: remoteData.description || "",
              price: Number(remoteData.price) || 0,
              thumbnail:
                remoteData.thumbnail ||
                remoteData.images?.[0] ||
                "https://placehold.co/400x250?text=Produk",
              images: Array.isArray(remoteData.images) ? remoteData.images : [],
              brand: remoteData.brand || "-",
              category: remoteData.category || "-",
              stock: remoteData.stock ?? "-",
              rating: remoteData.rating ?? "-",
              discountPercentage: remoteData.discountPercentage ?? 0,
            }
          : null;

      const mergedMap = new Map();
      localItems.forEach((it) => mergedMap.set(Number(it.id), it));
      if (remoteItem) {
        const key = Number(remoteItem.id);
        if (!mergedMap.has(key)) mergedMap.set(key, remoteItem);
      }

      const product = mergedMap.get(Number(productId));
      if (!product) {
        renderError("Produk tidak ditemukan pada kedua sumber data.");
        return;
      }

      renderDetail(product);
    })
    .catch((error) => {
      renderError(`Gagal mengambil detail produk: ${error.message}.`);
      console.error(error);
    });
}

updateCartLinkCount();
