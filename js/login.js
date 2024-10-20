async function onloadFunc() {
  checkMsgUrl();
  await loadUsersArray();
}

// check url for animate text "sign up successfully"
function checkMsgUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get('msg');

  if (msg) {
    document.getElementById('animatedText').innerHTML = msg;
    setTimeout(showDialog, 0.5);
  } else {
    document.getElementById('animatedText').style.display = '';
  }
  history.replaceState(null, '', '/html/login.html');
}

// load data save as array
async function loadUsersArray() {
  let usersResponse = await getAllUsers('users');
  let userKeysArray = Object.keys(usersResponse);

  for (let i = 0; i < userKeysArray.length; i++) {
    users.push({
      user: {
        // id: userKeysArray[i],
        id: i,
        ...usersResponse[userKeysArray[i]],
      },
    });
  }
  console.log('users', users);
}

async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + '.json');
  let responseAsJson = await response.json();
  console.log('responseAsJson', responseAsJson);
  return responseAsJson;
}

// compare user input to firebase
function login(event) {
  event.preventDefault();
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;

  let userId = checkUser(email, password);

  if (userId) {
    window.location.href = `/html/summary.html?msg=${userId}`;
  } else {
    document.getElementById('errorMsg').style.opacity = '1';
    document.getElementById('email').style.border = '1px solid red';
    document.getElementById('password').style.border = '1px solid red';
    console.log('Kein Benutzer gefunden');
  }
}

//  Check User input to firebase
function checkUser(email, password) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].user.email == email && users[i].user.password == password) {
      return users[i].user.id;
    }
  }
  return null;
}

function guestLoginRedirect() {
  let animatedElement = document.getElementById('animatedText');
  document.getElementById('dialogBg').style.display = 'flex';
  animatedElement.innerHTML = 'You successfully logged in as a guest!';
  setTimeout(function () {
    document.getElementById('dialogBg').style.display = 'none';
    window.location.href = 'summary.html?msg=guest';
  }, 3000);
}

// remove message email or password wrong
function removeErrorMsg() {
  document.getElementById('errorMsg').style.opacity = '0';
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
}

document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMsg');

  const changeBorderToBlack = (inputElement) => {
    emailInput.style.border = '1px solid rgba(0, 0, 0, 0.2)';
    inputElement.style.border = '1px solid rgba(0, 0, 0, 0.2)';
    errorMessage.innerHTML = '';
  };
  passwordInput.addEventListener('input', () => {
    changeBorderToBlack(passwordInput);
  });
});

// Mangage visibility password icons
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

document.addEventListener('DOMContentLoaded', () => {
  toggleVisibility('password', 'passwordLock', 'visibilityImg');
});
