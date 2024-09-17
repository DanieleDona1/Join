const BASE_URL =
  "https://contactstorage-593de-default-rtdb.europe-west1.firebasedatabase.app/";

async function onloadFunc() {
    await loadData("contact"); // Ladet existierende Kontakte
    
}

function openAddContact(){
  document.getElementById('background-pop-up').classList.remove('d-none')
  document.getElementById('pop-up-contact').classList.remove('d-none')
  document.querySelector('body').classList.add('overflow-hidden')
}

function closeAddContact(){
  document.getElementById('background-pop-up').classList.add('d-none')
  document.getElementById('pop-up-contact').classList.add('d-none')
  document.querySelector('body').classList.remove('overflow-hidden')
}

async function addContact(){
  let name = document.getElementById('name').value
  let mail = document.getElementById('email').value
  let phone = document.getElementById('phonenumber').value

    let newContact = await addNewContact(name, mail, phone); //function mit neuem kontakt zum hinzufügen  || könnte auch addNewCon weg lassen und mit postData und den namen aus inputfeld arbeiten

    console.log(newContact)

    let contactID = newContact.name; // newContact gibt ein object zurück in dem sich die spezifische id unter name befindet

}

function deleteContact(){
  
}

async function editContact(){


  // Ändern des Kontakts mittels PUT
  await putData("/contact/" + contactID, { name: "Berta", number: "9876543210" });
  console.log("Kontakt aktualisiert");
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson); 
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST", // Fügt Daten zum gewählten Pfad hinzu
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
}

async function putData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "PUT", // Überschreibt den Wert im gewählten Pfad
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
}


// Funktion zum Hinzufügen eines neuen Kontakts / Hilfsfunktion 
async function addNewContact(name, mail, number) {
    return await postData("/contact", { name: name, mail: mail, number: number });
}
