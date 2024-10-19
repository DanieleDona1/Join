function redirectToPage() {
  window.location.href = "board.html";
}

function checkMsgUrlId() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get('msg');

  if (msg != guest) {
    // innerhtml username
  } else {
    // innerHTML guest
  }
  history.replaceState(null, '', '/html/summary.html');
}

// window.location.href = "login.html?msg=You Signed Up successfully";
