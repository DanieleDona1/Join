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

  if (isValid) {
    addUser(formValues.name, formValues.email, formValues.password);
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
  const legalLink =  document.getElementById('legalLink');
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
function addUser(name, email, password) {
  postData('/users', { name: name, email: email, password: password });
  redirectToPage('../index.html?msg=You Signed Up successfully');
}

/**
 * Initializes password and checkbox input listeners on DOM content loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const checkbox = document.getElementById('formCheckbox');
  initializePasswordListeners(passwordInput, confirmPasswordInput);
  initializeCheckboxListener(checkbox);
});

/**
 * Sets up input listeners for password fields.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLInputElement} confirmPasswordInput - The confirm password input element.
 */
function initializePasswordListeners(passwordInput, confirmPasswordInput) {
  addInputListener(passwordInput, confirmPasswordInput);
  if (confirmPasswordInput) {
    addInputListener(confirmPasswordInput, passwordInput);
  }
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
 * Adds an input listener to the specified input element.
 * @param {HTMLInputElement} input1 - The first input element.
 * @param {HTMLInputElement} input2 - The second input element.
 */
function addInputListener(input1, input2) {
  input1.addEventListener('input', () => changeBorderToBlack(input1, input2));
}

/**
 * Changes the border color of input elements to black and clears error messages.
 * @param {...HTMLInputElement} inputElements - The input elements to style.
 */
function changeBorderToBlack(...inputElements) {
  const errorMessage = document.getElementById('errorSignupMsg');
  inputElements.forEach((inputElement) => {
    inputElement.style.border = '1px solid rgba(0, 0, 0, 0.2)';
  });
  errorMessage.innerHTML = '';
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
  const legalLink =  document.getElementById('legalLink');
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
