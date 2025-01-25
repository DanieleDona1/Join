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
  resetInputBorderOnKeydown('loginForm');
  initializeForm('loginForm', 'loginBtn');
  removeUserToken();
}

/**
 * Checks the URL for a 'msg' parameter and displays it by starting an animation.
 * Updates the URL to './index.html'.
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
  // history.replaceState(null, '', './login.html');
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
    redirectToPage('./html/summary.html');
  } else {
    document.getElementById('errorMsg').style.opacity = '1';
    document.getElementById('email').style.border = '1px solid red';
    document.getElementById('password').style.border = '1px solid red';
    document.getElementById('loginBtn').classList.add('disabled');
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
function guestLoginRedirect(url) {
  saveToLocalStorage('user', 'Guest');
  redirectToPage(url);
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
 * Checks whether all input fields in the specified form are filled.
 * If all fields are filled, it enables the submit button by removing the 'disabled' class.
 * If any field is empty, it disables the submit button by adding the 'disabled' class.
 *
 * @param {string} formId - The ID of the form to check.
 * @param {string} btnId - The ID of the submit button to enable/disable.
 */
function checkInputs(formId, btnId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input');
  let allFilled = true;
  inputs.forEach((input) => {
    if (input.value.trim() === '') allFilled = false;
  });
  const submitBtn = document.getElementById(btnId);
  if (allFilled) {
    submitBtn.classList.remove('disabled');
  } else {
    submitBtn.classList.add('disabled');
  }
}

/**
 * Initializes the form by adding event listeners to its input fields.
 * It listens for the `keyup` event on each input and calls `checkInputs`
 * to check whether the form fields are filled. Also performs an initial
 * check when the form is initialized.
 *
 * @param {string} formId - The ID of the form element to initialize.
 * @param {string} btnId - The ID of the submit button that should be enabled/disabled.
 */
function initializeForm(formId, btnId) {
  const form = document.getElementById(formId);

  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('keyup', () => checkInputs(formId, btnId));
  });
  checkInputs(formId, btnId);
}

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
