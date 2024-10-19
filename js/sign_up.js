function validatePasswordsAndCheckbox(event) {
  event.preventDefault();

  let formValues = getFormValues();

  if (formValues.password !== formValues.confirmPassword) {
    document.getElementById("errorSignupMsg").innerHTML =
      "Your passwords don't match. Please try again.";
    document.getElementById("password").style.border = "1px solid red";
    document.getElementById("confirmPassword").style.border = "1px solid red";
  }
  if (document.getElementById("formCheckbox").checked === false) {
    document.getElementById("formCheckbox").style.border = "2px solid red";
    document.getElementById("legalText").style.color = "red";
    document.getElementById("legalText").style.opacity = "1";
  }

  if (
    formValues.password === formValues.confirmPassword &&
    document.getElementById("formCheckbox").checked
  ) {
    addUser(formValues.name, formValues.email, formValues.password);
  }
}

function addUser(name, email, password) {
  postData("/users", { name: name, email: email, password: password });

  window.location.href = "login.html?msg=You Signed Up successfully";
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const checkbox = document.getElementById("formCheckbox");
  initializePasswordListeners(passwordInput, confirmPasswordInput);
  initializeCheckboxListener(checkbox);
});

function initializePasswordListeners(passwordInput, confirmPasswordInput) {
  addInputListener(passwordInput, confirmPasswordInput);
  if (confirmPasswordInput) {
    addInputListener(confirmPasswordInput, passwordInput);
  }
}

function initializeCheckboxListener(checkbox) {
  if (checkbox) {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        updateCheckboxStyle(checkbox, "black", 0.25);
      }
    });
  }
}

function addInputListener(input1, input2){
  input1.addEventListener("input", () => changeBorderToBlack(input1, input2));
};

function changeBorderToBlack(...inputElements){
  const errorMessage = document.getElementById("errorSignupMsg");
  inputElements.forEach(inputElement => {
    inputElement.style.border = "1px solid rgba(0, 0, 0, 0.2)";
  });
  errorMessage.innerHTML = '';
};

function updateCheckboxStyle(checkboxElement, color, opacity){
  legalText.style.color = color;
  legalText.style.opacity = opacity;
  checkboxElement.style.border = `1px solid ${color}`;
};

function getFormValues() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    return {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };
  }

  function managePasswordVisibilityIcons(passwordField, passwordLock, visibilityBtn) {
    passwordField.addEventListener("input", () => {
      if (passwordField.value.trim() !== "") {
        passwordLock.classList.add("d-none");
        visibilityBtn.classList.remove("d-none");
      } else {
        passwordLock.classList.remove("d-none");
        visibilityBtn.classList.add("d-none");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    toggleVisibility("password", "passwordLock", "visibilityImg");
    toggleVisibility("confirmPassword", "passwordLockConfirm", "visibilityImgConfirm");
  });
