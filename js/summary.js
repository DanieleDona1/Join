function redirectToPage() {
  window.location.href = 'board.html';
}

async function onload() {
  await loadUsersArray();
  greetUser();
}

function greetUser() {
  const userGreetingElement = document.getElementById('greeting');
  const userNameElement = document.getElementById('userName');

  const userName = getUserName();

  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  userGreetingElement.innerHTML = `${greeting},`;
  userNameElement.innerHTML = `${userName}!`;
}



function getUserName() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get('msg');
  let userName = 'Unknown User';

  if (msg) {
    if (msg !== 'guest') {
      if (users[msg] && users[msg].user && users[msg].user.name) {
        userName = users[msg].user.name;
      }
    } else {
      userName = 'Guest';
    }
  }
  return userName;
}


// doppelt summary und login.js
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

// doppelt summary und login.js
async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + '.json');
  let responseAsJson = await response.json();
  return responseAsJson;
}

// window.location.href = "login.html?msg=You Signed Up successfully";
