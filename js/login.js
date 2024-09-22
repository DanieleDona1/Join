let responseAsJson = {};

const BASE_URL =
  "https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/";

async function onloadFunc() {
  checkMsgUrl();
  await onload();
}

function checkMsgUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");

  if (msg) {
    document.getElementById("animatedText").innerHTML = msg;
    setTimeout(showDialog, 0.5);
  } else {
    document.getElementById("animatedText").style.display = "none";
  }
  history.replaceState(null, "", "/html/login.html");
}

async function onload() {
  let response = await fetch(BASE_URL + ".json");
  responseAsJson = await response.json();
  console.log("ResponseAsJson ", responseAsJson);
}

function login(event) {
  event.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let userkey = checkUser(email, password);

  if (userkey) {
    // history.replaceState(null, "", "/html/login.html");

    window.location.href = `/html/summary.html?msg=${responseAsJson.users[userkey].name}`;
  } else {
    document.getElementById("errorMsg").style.opacity = "1";
    document.getElementById("email").style.border = "1px solid red";
    document.getElementById("password").style.border = "1px solid red";
    console.log("Kein Benutzer gefunden");
  }
}

function checkUser(email, password) {
  for (const key in responseAsJson.users) {
    const user = responseAsJson.users[key];

    if (user.email == email && user.password == password) {
      return key;
    }
  }
  return null;
}

function removeErrorMsg() {
  document.getElementById("errorMsg").style.opacity = "0";
}

document.addEventListener("DOMContentLoaded", () => {
  const dialogBg = document.getElementById("dialogBg");

  if (dialogBg) {
    dialogBg.addEventListener("animationend", () => {
      dialogBg.style.display = "none";
    });
  }
});

function showDialog() {
  document.getElementById("dialogBg").style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("errorMsg");

  const changeBorderToBlack = (inputElement) => {
    emailInput.style.border = "1px solid rgba(0, 0, 0, 0.2)";
    inputElement.style.border = "1px solid rgba(0, 0, 0, 0.2)";
    errorMessage.innerHTML = "";
  };

  passwordInput.addEventListener("input", () => {
    changeBorderToBlack(passwordInput);
  });
});

// func allgemein
function togglePasswordVisibility(passwordFieldId, visibilityImgId) {
  let passwordField = document.getElementById(passwordFieldId);  
  let visibilityBtn = document.getElementById(visibilityImgId);

  if (passwordField.type === "password") {
      passwordField.type = "text";
      visibilityBtn.src = "/assets/img/visibility.svg";
      
  } else {
      passwordField.type = "password";
      visibilityBtn.src = "/assets/img/visibility_off.svg";
  }
}

function toggleVisibility(passwordFieldId, passwordLockId, visibilityBtnId) {
  const passwordField = document.getElementById(passwordFieldId);
  const passwordLock = document.getElementById(passwordLockId);
  const visibilityBtn = document.getElementById(visibilityBtnId);

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
});