/**
 * Loads todos and users, and checks for a message in the URL.
 *
 * @async
 * @function onloadFunc
 * @returns {Promise<void>}
 */
async function onloadFunc() {
  await loadTodosArray();
  checkMsgUrl();
  await loadUsersArray();
}

/**
 * Checks the URL for a 'msg' parameter and displays it by starting an animation.
 * Updates the URL to '/html/login.html'.
 *
 * @function
 * @returns {void}
 */
function checkMsgUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get('msg');

  if (msg) {
    document.getElementById('animatedText').innerHTML = msg;
    setTimeout(showDialog, 0.5);
  } else {
    document.getElementById('animatedText').style.display = '';
  }
  history.replaceState(null, '', '/html/login.html');
}

/**
 * Validates user login against stored users and redirects on success.
 *
 * @function login
 * @param {Event} event - The event triggered by form submission.
 * @returns {void}
 */
function login(event) {
  event.preventDefault();
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let userKey = checkUser(email, password);

  if (userKey) {
    saveToLocalStorage('user', userKey);
    window.location.href = '/html/summary.html';
  } else {
    document.getElementById('errorMsg').style.opacity = '1';
    document.getElementById('email').style.border = '1px solid red';
    document.getElementById('password').style.border = '1px solid red';
    console.log('Kein Benutzer gefunden');
  }
}

/**
 * Checks the URL for a 'msg' parameter and displays it with an animation.
 *
 * @function checkMsgUrl
 * @returns {void}
 */
function checkUser(email, password) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].user.email == email && users[i].user.password == password) {
      return users[i].user.userKey;
    }
  }
  return null;
}

/**
 * Saves a key-value pair to local storage.
 *
 * @function saveToLocalStorage
 * @param {string} key - The key under which to store the value.
 * @param {string} value - The value to store.
 * @returns {void}
 */
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

/**
 * Redirects guest users.
 *
 * @function guestLoginRedirect
 * @returns {void}
 */
function guestLoginRedirect() {
  redirectToPage('summary.html');
}

/**
 * Hides the error message on the login form.
 *
 * @function removeErrorMsg
 * @returns {void}
 */
function removeErrorMsg() {
  document.getElementById('errorMsg').style.opacity = '0';
}

/**
 * Sets up event listeners for DOM content loaded events.
 * Sets up an event listener for the dialog background to hide it once the animation ends.
 *
 * @function
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  const dialogBg = document.getElementById('dialogBg');

  if (dialogBg) {
    dialogBg.addEventListener('animationend', () => {
      dialogBg.style.display = 'none';
    });
  }
});

/**
 * Displays a dialog box.
 *
 * @function showDialog
 * @returns {void}
 */
function showDialog() {
  document.getElementById('dialogBg').style.display = 'flex';
}

/**
 * Manages input border styles and error message visibility.
 *
 * @function
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMsg');

  const changeBorderToBlack = (inputElement) => {
    emailInput.style.border = '1px solid rgba(0, 0, 0, 0.2)';
    inputElement.style.border = '1px solid rgba(0, 0, 0, 0.2)';
    errorMessage.innerHTML = '';
  };
  passwordInput.addEventListener('input', () => {
    changeBorderToBlack(passwordInput);
  });
});

/**
 * Manages the visibility of password icons based on input.
 *
 * @function managePasswordVisibilityIcons
 * @param {HTMLElement} passwordField - The password input field.
 * @param {HTMLElement} passwordLock - The locked icon element.
 * @param {HTMLElement} visibilityBtn - The visibility toggle button.
 * @returns {void}
 */
function managePasswordVisibilityIcons(passwordField, passwordLock, visibilityBtn) {
  passwordField.addEventListener('input', () => {
    if (passwordField.value.trim() !== '') {
      passwordLock.classList.add('d-none');
      visibilityBtn.classList.remove('d-none');
    } else {
      passwordLock.classList.remove('d-none');
      visibilityBtn.classList.add('d-none');
    }
  });
}

/**
 * Initializes the password visibility toggle.
 *
 * @function
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  toggleVisibility('password', 'passwordLock', 'visibilityImg');
});
