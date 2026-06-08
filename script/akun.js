const akunNama = document.getElementById("akun-nama");
const akunUsername = document.getElementById("akun-username");
const namaCard = document.getElementById("nama-card");
const usernameCard = document.getElementById("username-card");
const logoutButton = document.getElementById("logout-btn");
const logoutNavBtn = document.getElementById("logout-nav-btn");
const dropdownAvatarNameButton = document.getElementById(
  "dropdownAvatarNameButton",
);
const dropdownAvatarName = document.getElementById("dropdownAvatarName");
const dropdownNameButton = document.getElementById("dropdown-name-button");

function renderAkun() {
  const nama = sessionStorage.getItem("nama");
  const username = sessionStorage.getItem("username");
  const displayName = nama || "User";
  const displayUsername = username ? `@${username}` : "@username";

  if (akunNama) akunNama.textContent = displayName;
  if (akunUsername) akunUsername.textContent = displayUsername;
  if (namaCard) namaCard.textContent = displayName;
  if (usernameCard) usernameCard.textContent = username || "-";

  if (dropdownNameButton) dropdownNameButton.textContent = displayName;
}

function setupDropdown() {
  if (!dropdownAvatarNameButton || !dropdownAvatarName) return;

  dropdownAvatarNameButton.onclick = (e) => {
    e.stopPropagation();
    dropdownAvatarName.classList.toggle("hidden");
  };

  document.onclick = () => {
    if (!dropdownAvatarName.classList.contains("hidden")) {
      dropdownAvatarName.classList.add("hidden");
    }
  };
}

function logout() {
  sessionStorage.clear();
  window.location.href = "../index.html";
  window.location.replace("../index.html");
}

document.addEventListener("DOMContentLoaded", () => {
  renderAkun();
  setupDropdown();

  logoutButton?.addEventListener("click", logout);
  logoutNavBtn?.addEventListener("click", logout);
});
