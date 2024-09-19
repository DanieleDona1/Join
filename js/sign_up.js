
function addUser() {
    let  name = document.getElementById('name').value;
    let  email = document.getElementById('email').value;
    let  password = document.getElementById('password').value;

    users.push({"name": name.value,"email": email.value, "password": password.value,});
    console.log(users);
    postData("/users", {"name": name,"email": email, "password": password,})
    
    window.location.href = "login.html?msg=Du hast dich erfolgreich registriert!";
}

async function postData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}