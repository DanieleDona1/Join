const BASE_URL =
  "https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/";
  
function validatePasswordsAndCheckbox(event) {
  event.preventDefault();
    
    let formValues = getFormValues();  


  if (formValues.password !== formValues.confirmPassword) {
    document.getElementById("errorSignupMsg").innerHTML = "Your passwords don't match. Please try again.";
    document.getElementById("password").style.border = "1px solid red";
    document.getElementById("confirmPassword").style.border = "1px solid red";
  }
  if (document.getElementById("formCheckbox").checked === false) {
    document.getElementById("formCheckbox").style.border = "2px solid red";
    document.getElementById("legalText").style.color = "red";
    document.getElementById("legalText").style.opacity = "1";
  }

  if (formValues.password === formValues.confirmPassword && document.getElementById("formCheckbox").checked) {
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
  const errorMessage = document.getElementById("errorSignupMsg");
  const checkbox = document.getElementById("formCheckbox");

  const changeBorderToBlack = (inputElement) => {
    inputElement.style.border = "1px solid rgba(0, 0, 0, 0.2)";
    errorMessage.innerHTML = '';
  };

  passwordInput.addEventListener("input", () => {
    changeBorderToBlack(passwordInput);
    changeBorderToBlack(confirmPasswordInput);
  });

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", () => {
      changeBorderToBlack(confirmPasswordInput);
      changeBorderToBlack(passwordInput);
    });
  }

  if (checkbox) {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        legalText.style.color = "black";
        legalText.style.opacity = "0.25";
        checkbox.style.border = "1px solid black";
      }
    });
  }
});


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