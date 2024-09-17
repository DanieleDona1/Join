let users = [];

function addUser() {
    let  name = document.getElementById('name');
    let  email = document.getElementById('email');
    let  password = document.getElementById('password');
    // let  confirmPassword = document.getElementById('confirmPassword');

    users.push({"name": name.value,"email": email.value, "password": password.value,});
    console.log(users);
    window.location.href = "login.html?msg=Du hast dich erfolgreich registriert!";
    // name.value  = '';
    // email.value = '';
    // password.value = '';
    // confirmPassword.value = '';
}


