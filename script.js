document.addEventListener("DOMContentLoaded", function init() {
  highlightActiveLink();
  updateFavicon();
});

function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(
    ".navbar-item, .navbar-disclaimer-links-container a"
  );

  for (let i = 0; i < navLinks.length; i++) {
    highlightLink(navLinks[i], currentPath);
  }
}

function highlightLink(link, currentPath) {
  const linkPath = new URL(link.href).pathname;
  if (linkPath === currentPath) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
}

function goBack() {
  window.history.back();
}

function updateFavicon() {
  const favicon = document.getElementById("favicon");
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  favicon.href = darkModeMediaQuery.matches
    ? "/assets/icons/favicons/favicon_dark.png"
    : "/assets/icons/favicons/favicon_light.png";
}

