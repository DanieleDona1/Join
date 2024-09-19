let users = {};

const BASE_URL = "https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/";

async function onloadFunc() {
  checkMsgUrl();
  await onload();  
}

function checkMsgUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");

  if (msg) {
    msgBox.innerHTML = msg;
  } else {
    document.getElementById("msgBox").style.display = "none";
  }
}

async function onload() { 
  let response = await fetch(BASE_URL + ".json");
  let responseAsJson = await response.json();
  users = responseAsJson;
  console.log("ResponseAsJson ", users);
}

function login(event) {
  event.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let userkey = checkUser(email, password);

  if (userkey) {
    window.location.href = `/html/summary.html?msg=${users.users[userkey].name}`;
  } else {
    console.log('Kein Benutzer gefunden');
  }
}

function checkUser(email, password) {
  for (const key in users.users) {
    const user = users.users[key];
    if (user.email === email && user.password === password) {
      return key;
    }
  }
  return null;
}