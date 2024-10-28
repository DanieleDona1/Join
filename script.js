const BASE_URL = 'https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/';

let todos = [];
let currentTodos = [];
let todoKeysArray = [];
let users = [];

/**
 * Initializes the application when the DOM is fully loaded.
 * Highlights the active link and updates the favicon.
 * @function init
 */
document.addEventListener('DOMContentLoaded', function init() {
  highlightActiveLink();
  updateFavicon();
});

/**
 * Loads todos from the database and stores them in the todos array.
 * @async
 * @function loadTodosArray
 */
async function loadUsersArray() {
  let usersResponse = await getDataAsJson('users');
  if (usersResponse) {
    let userKeysArray = Object.keys(usersResponse);

    for (let i = 0; i < userKeysArray.length; i++) {
      users.push({
        user: {
          userKey: userKeysArray[i],
          id: i,
          ...usersResponse[userKeysArray[i]],
        },
      });
    }
  }
  console.log('users', users);
}

/**
 * Loads todos from the database and stores them in the todos array.
 * @async
 * @function loadTodosArray
 */
async function loadTodosArray() {
  let todosResponse = await getDataAsJson('todos');
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

/**
 * Fetches all users or todos from the specified path in the database.
 * @async
 * @param {string} path - The path to fetch data from ('users' or 'todos').
 * @returns {Promise<Object>} The response data as JSON.
 * @function getDataAsJson
 */
async function getDataAsJson(path) {
  let response = await fetch(BASE_URL + path + '.json');
  let responseAsJson = await response.json();
  return responseAsJson;
}

/**
 * Highlights the active navigation link based on the current page.
 * @function highlightActiveLink
 */
function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-item, .navbar-disclaimer-links-container a');
  for (let i = 0; i < navLinks.length; i++) {
    highlightLink(navLinks[i], currentPath);
  }
}

/**
 * Highlights a specific link if it matches the current path.
 * @param {HTMLElement} link - The link element to check.
 * @param {string} currentPath - The current page path.
 * @function highlightLink
 */
function highlightLink(link, currentPath) {
  const linkPath = new URL(link.href).pathname;
  if (linkPath === currentPath) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
}

/**
 * Navigates the user back to the previous page in the browser history.
 * @function goBack
 */
function goBack() {
  window.history.back();
}

/**
 * Updates the favicon based on the user's color scheme preference.
 * @function updateFavicon
 */
function updateFavicon() {
  const favicon = document.getElementById('favicon');
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  favicon.href = darkModeMediaQuery.matches ? '/assets/icons/favicons/favicon_dark.png' : '/assets/icons/favicons/favicon_light.png';
}

/**
 * Toggles the visibility of a password field.
 * @param {string} passwordFieldId - The ID of the password input field.
 * @param {string} visibilityImgId - The ID of the visibility icon.
 * @function togglePasswordVisibility
 */
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

/**
 * Toggles visibility of a password field and manages visibility icons.
 * @param {string} passwordFieldId - The ID of the password input field.
 * @param {string} passwordLockId - The ID of the password lock icon.
 * @param {string} visibilityBtnId - The ID of the visibility toggle button.
 * @function toggleVisibility
 */
function toggleVisibility(passwordFieldId, passwordLockId, visibilityBtnId) {
  const passwordField = document.getElementById(passwordFieldId);
  const passwordLock = document.getElementById(passwordLockId);
  const visibilityBtn = document.getElementById(visibilityBtnId);

  managePasswordVisibilityIcons(passwordField, passwordLock, visibilityBtn);
}
