function checkMsgUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");

  if (msg) {
    msgBox.innerHTML = msg;
  } else {
    document.getElementById("msgBox").style.display = "none";
  }
}

function login(event) {
  event.preventDefault();
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let name = document.getElementById("name");

  let user = users.find(
    (user) => user.email == email.value && user.password == password.value
  );

  if (user) {
    // document.getElementById('logoAnimation').classList.add('paused');
    console.log("User gefunden!");
    window.location.href = `/html/summary.html?msg=${name.value}`;
  } else {
    console.log("Kein User gefunden!");
  }
}
