let users = JSON.parse(localStorage.getItem("users")) || [];

const form = document.getElementById("registerForm");
const hasil = document.getElementById("hasilRegister");

function tampilkanPesan(pesan, tipe = "info") {
  hasil.textContent = pesan;

  hasil.className = "mt-4 text-center text-sm font-medium";

  if (tipe === "success") {
    hasil.classList.add("text-green-600");
  } else if (tipe === "error") {
    hasil.classList.add("text-red-600");
  } else {
    hasil.classList.add("text-slate-600");
  }
}

function simpanUser(userBaru) {
  users.push(userBaru);

  localStorage.setItem("users", JSON.stringify(users));
}

function usernameSudahAda(username) {
  return users.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
}

function handleRegister(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();

  const username = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value.trim();

  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  if (!nama || !username || !password || !confirmPassword) {
    tampilkanPesan("Semua data wajib diisi", "error");
    return;
  }

  if (password.length < 6) {
    tampilkanPesan("Password minimal 6 karakter", "error");
    return;
  }

  if (password !== confirmPassword) {
    tampilkanPesan("Konfirmasi password tidak cocok", "error");
    return;
  }

  if (usernameSudahAda(username)) {
    tampilkanPesan("Username sudah digunakan", "error");
    return;
  }

  const userBaru = {
    id: Date.now(),
    nama,
    username,
    password,
  };

  simpanUser(userBaru);

  sessionStorage.setItem("nama", nama);

  sessionStorage.setItem("username", username);

  tampilkanPesan("Pendaftaran berhasil", "success");

  setTimeout(() => {
    window.location.href = "./produk.html";
  }, 1200);
}

document.addEventListener("DOMContentLoaded", () => {
  form?.addEventListener("submit", handleRegister);
});
