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
    document.getElementById('animatedText').innerHTML = msg;
    setTimeout(showDialog, 0.5);
  } else {
    document.getElementById("animatedText").style.display = "none";
  }
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
    history.replaceState(null, "", "/html/login.html");

    window.location.href = `/html/summary.html?msg=${responseAsJson.users[userkey].name}`;
  } else {
    document.getElementById("errorMsg").style.opacity = "1";
    document.querySelectorAll(".error-input").forEach(element => {
      element.style.border = "1px solid red";
  });
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


document.addEventListener('DOMContentLoaded', () => {
  const dialogBg = document.getElementById('dialogBg');
  
  if (dialogBg) {
    dialogBg.addEventListener('animationend', () => {
      dialogBg.style.display = 'none';
    });
  }
});

function showDialog() {
  document.getElementById('dialogBg').style.display = 'flex';
};