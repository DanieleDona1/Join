function validatePasswordsAndCheckbox() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let errorMessage = document.getElementById('errorSignupMsg');
    const checkbox = document.getElementById('formCheckbox');
  
    if (password !== confirmPassword) {
      errorMessage.innerHTML = 'Your passwords don\'t match. Please try again.';
      document.getElementById('password').style.border = '1px solid red';
      document.getElementById('confirmPassword').style.border = '1px solid red';

    }else if (!checkbox.checked) {
        checkbox.style.outline = '2px solid red';
    } else {
      addUser(name, email, password, confirmPassword);
    }
  }
  



function addUser(name, email, password) {

    postData("/users", {"name": name,"email": email, "password": password,})
    
    window.location.href = "login.html?msg=You Signed Up successfully";
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



document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorMessage = document.getElementById('errorSignupMsg');

    const changeBorderToBlack = (inputElement) => {
      inputElement.style.border = '1px solid rgba(0, 0, 0, 0.2)';
      errorMessage.innerHTML = '';
    };
    passwordInput.addEventListener('input', () => {
      changeBorderToBlack(passwordInput);
      changeBorderToBlack(confirmPasswordInput);
    });
    confirmPasswordInput.addEventListener('input', () => {
      changeBorderToBlack(confirmPasswordInput);
      changeBorderToBlack(passwordInput);
    });
});