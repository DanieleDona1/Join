function onloadFunc() {
    checkMsgUrl();
    onload();   
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

BASE_URL = "https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/";

async function onload() {
    let response = await fetch(BASE_URL + ".json");
    let responseAsJson =  await response.json();
    console.log(responseAsJson);
}

function login(event) {
  event.preventDefault();
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let name = document.getElementById("name");

  let index = users.findIndex(
    (user) => user.email == email.value && user.password == password.value
  );

  if (index != -1) {
    console.log("User gefunden!");
    window.location.href = `/html/summary.html?msg=${users[index].name}`;
  } else {
    console.log("Kein User gefunden!");
  }
}
