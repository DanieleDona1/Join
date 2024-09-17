let users = [{"name": "Daniel","email": "a@a", "password": "123"}];

function addUser() {
    let  name = document.getElementById('name');
    let  email = document.getElementById('email');
    let  password = document.getElementById('password');

    users.push({"name": name.value,"email": email.value, "password": password.value,});
    console.log(users);
    window.location.href = "login.html?msg=Du hast dich erfolgreich registriert!";
}


