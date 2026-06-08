let User = [];
let dataSiap = false;

function setLoginMessage(element, message, type = "info") {
  if (!element) return;

  element.textContent = message;
  element.className =
    "mt-4 p-4 rounded-2xl text-center text-sm font-bold transition-all duration-300";

  switch (type) {
    case "success":
      element.classList.add("bg-green-50", "text-green-600");
      break;

    case "error":
      element.classList.add("bg-red-50", "text-red-600");
      break;

    default:
      element.classList.add("bg-slate-100", "text-slate-600");
  }
}

async function memuatUser() {
  try {
    const response = await fetch("/json/Dataakun.json");

    if (!response.ok) {
      throw new Error("Gagal memuat data user");
    }

    User = await response.json();
    dataSiap = true;
  } catch (error) {
    console.error(error);

    const hasil = document.getElementById("hasil");

    setLoginMessage(hasil, "Data login gagal dimuat", "error");
  }
}

async function handleLogin() {
  const username = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value.trim();

  const hasil = document.getElementById("hasil");

  const tombol = document.querySelector('button[type="submit"]');

  if (!dataSiap) {
    setLoginMessage(hasil, "Data masih dimuat...", "error");
    return;
  }

  if (!username || !password) {
    setLoginMessage(hasil, "Lengkapi semua data", "error");
    return;
  }

  tombol.disabled = true;
  tombol.innerHTML = "Memproses...";

  const userLogin = User.find(
    (user) => user.username === username && user.password === password,
  );

  setTimeout(() => {
    if (userLogin) {
      sessionStorage.setItem("nama", userLogin.nama);

      sessionStorage.setItem("username", userLogin.username);

      setLoginMessage(hasil, "Login berhasil", "success");

      setTimeout(() => {
        window.location.href = "./produk.html";
      }, 1000);
    } else {
      tombol.disabled = false;
      tombol.innerHTML = "Masuk";

      setLoginMessage(hasil, "Username atau password salah", "error");
    }
  }, 800);
}

document.addEventListener("DOMContentLoaded", async () => {
  await memuatUser();

  const form = document.getElementById("loginForm");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleLogin();
  });

  const password = document.getElementById("password");

  const toggle = document.getElementById("togglePassword");

  if (toggle && password) {
    toggle.addEventListener("click", () => {
      password.type = password.type === "password" ? "text" : "password";
    });
  }
});

window.handleLogin = handleLogin;
