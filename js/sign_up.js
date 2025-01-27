function onloadSignUp() {
  resetInputBorderOnKeydown('signupForm');
  initializeForm('signupForm', 'signupBtn');
}

/**
 * Validates password and checkbox inputs and adds the user if valid.
 * @param {Event} event - The event triggered by form submission.
 */
function validatePasswordsAndCheckbox(event) {
  event.preventDefault();
  let formValues = getFormValues();
  let isValid = true;

  isValid = validatePasswords(formValues) && isValid;
  isValid = validateCheckbox() && isValid;
  isValid = isValidEmail(formValues.email) && isValid;

  if (isValid) {
    addUser(formValues.name, formValues.email, formValues.password);
  }
}

/**
 * Validates an email address using a regular expression.
 * If the email is valid, it returns true. If not, it changes the border style of the email input to red.
 *
 * @function isValidEmail
 * @param {string} email - The email address to be validated.
 * @returns {boolean} Returns `true` if the email is valid, otherwise `false` and sets the border of the email input to red.
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const emailInput = document.getElementById('email');

  if (emailRegex.test(email)) {
    return true;
  } else {
    emailInput.style.border = '1px solid red';
    document.getElementById('emailError').style.display = 'block';
    return false;
  }
}

/**
 * Validates if the provided passwords match and updates the UI accordingly.
 * @param {Object} formValues - The form values containing password and confirmPassword.
 * @returns {boolean} - True if passwords match, otherwise false.
 */
function validatePasswords(formValues) {
  const passwordError = document.getElementById('errorSignupMsg');
  const passwordField = document.getElementById('password');
  const confirmPasswordField = document.getElementById('confirmPassword');

  if (formValues.password !== formValues.confirmPassword) {
    passwordError.innerHTML = "Your passwords don't match. Please try again.";
    passwordField.style.border = '1px solid red';
    confirmPasswordField.style.border = '1px solid red';
    return false;
  }
  passwordField.style.border = '';
  confirmPasswordField.style.border = '';
  return true;
}

/**
 * Checks if the checkbox is checked and updates the UI accordingly.
 * @returns {boolean} - True if checkbox is checked, otherwise false.
 */
function validateCheckbox() {
  const checkbox = document.getElementById('formCheckbox');
  const legalLink = document.getElementById('legalLink');
  const legalText = document.getElementById('legalText');
  if (!checkbox.checked) {
    checkbox.style.border = '2px solid red';
    legalText.style.color = 'red';
    legalText.style.opacity = '1';
    legalLink.classList.add('color-red');
    return false;
  }
  checkbox.style.border = '';
  legalText.style.color = '';
  legalText.style.opacity = '';
  legalLink.classList.remove('color-red');
  return true;
}

/**
 * Sends a POST request to add a new user and redirects to the login page.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 */
async function addUser(name, email, password) {
  await postData('/users', { name: name, email: email, password: password });
  redirectToPage('../index.html?msg=You Signed Up successfully');
}

/**
 * Sets up a listener for the checkbox input.
 * @param {HTMLInputElement} checkbox - The checkbox element.
 */
function initializeCheckboxListener(checkbox) {
  if (checkbox) {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        updateCheckboxStyle(checkbox);
      }
    });
  }
}

/**
 * Resets the styles of the checkbox, legal text, and legal link elements.
 *
 * This function clears any applied border style on the checkbox, restores
 * the default color and opacity of the legal text, and removes the 'color-red'
 * class from the legal link.
 *
 * @param {HTMLInputElement} checkboxElement - The checkbox input element whose style will be reset.
 */
function updateCheckboxStyle(checkboxElement) {
  const legalLink = document.getElementById('legalLink');
  const legalText = document.getElementById('legalText');
  checkboxElement.style.border = '';
  legalText.style.color = '';
  legalText.style.opacity = '';
  legalLink.classList.remove('color-red');
}

/**
 * Retrieves values from the form inputs.
 * @returns {Object} - An object containing name, email, password, and confirmPassword.
 */
function getFormValues() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let confirmPassword = document.getElementById('confirmPassword').value;

  return {
    name: name,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  };
}

/**
 * Manages visibility icons for password fields based on input.
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLElement} passwordLock - The lock icon element.
 * @param {HTMLElement} visibilityBtn - The visibility toggle button.
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
 * Initializes visibility toggle for password fields on DOM content loaded.
 * Toggles the visibility icons based on the state of the password inputs.
 */
document.addEventListener('DOMContentLoaded', () => {
  toggleVisibility('password', 'passwordLock', 'visibilityImg');
  toggleVisibility('confirmPassword', 'passwordLockConfirm', 'visibilityImgConfirm');
});

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
  let isCheckboxChecked = checkCheckbox();

  if (allFilled && isCheckboxChecked) {
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
 * Checks if the checkbox with the ID 'formCheckbox' is checked.
 *
 * @function checkCheckbox
 * @returns {boolean} Returns `true` if the checkbox is checked, otherwise `false`.
 */
function checkCheckbox() {
  const checkbox = document.getElementById('formCheckbox');
  if (checkbox.checked) {
    return true;
  } else {
    return false;
  }
}

/**
 * Entfernt die Fehlermeldung, indem das entsprechende HTML-Element ausgeblendet wird.
 * Das Element mit der ID 'emailError' wird auf `display: none` gesetzt,
 * um die Anzeige der Fehlermeldung zu verhindern.
 *
 * @function
 * @returns {void} Diese Funktion gibt keinen Wert zurück.
 */
function removeErrorMsg() {
  document.getElementById('emailError').style.display = 'none';
}
