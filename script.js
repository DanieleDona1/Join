document.addEventListener("DOMContentLoaded", () => {
  highlightActiveLink();
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
