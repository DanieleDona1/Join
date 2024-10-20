const BASE_URL = 'https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/';
// board.js Arrays
let todos = [];
let currentTodos = [];
let todoKeysArray = [];
// sign_up Array
let users = [];

document.addEventListener("DOMContentLoaded", function init() {
  highlightActiveLink();
  updateFavicon();
});

// load data save as array (für summary.js und login.js)
async function loadUsersArray() {
  let usersResponse = await getAllUsers('users');
  let userKeysArray = Object.keys(usersResponse);

  for (let i = 0; i < userKeysArray.length; i++) {
    users.push({
      user: {
        // id: userKeysArray[i],
        id: i,
        ...usersResponse[userKeysArray[i]],
      },
    });
  }
  console.log('users', users);
}

// (für board.js und summary.js)
async function loadTodosArray() {
  let todosResponse = await getAllUsers('todos');
  if (todosResponse) {
    todoKeysArray = Object.keys(todosResponse);
    todos = [];

    for (let i = 0; i < todoKeysArray.length; i++) {
      todos.push({
        id: i,
        ...todosResponse[todoKeysArray[i]],
      });
    }
  } else {
    console.log('No todos found, Database is empty');
  }
}

// (für summary.js, login.js und board.js)
async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + '.json');
  let responseAsJson = await response.json();
  return responseAsJson;
}

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

//Beide Funktionen für sign up und login
function togglePasswordVisibility(passwordFieldId, visibilityImgId) {
  let passwordField = document.getElementById(passwordFieldId);
  let visibilityBtn = document.getElementById(visibilityImgId);

  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    visibilityBtn.src = '/assets/icons/auth/visibility.svg';
  } else {
    passwordField.type = 'password';
    visibilityBtn.src = '/assets/icons/auth/visibility_off.svg';
  }
}

function toggleVisibility(passwordFieldId, passwordLockId, visibilityBtnId) {
  const passwordField = document.getElementById(passwordFieldId);
  const passwordLock = document.getElementById(passwordLockId);
  const visibilityBtn = document.getElementById(visibilityBtnId);

  managePasswordVisibilityIcons(passwordField, passwordLock, visibilityBtn);
}
