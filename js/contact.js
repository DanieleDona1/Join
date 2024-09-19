const BASE_URL =
  "https://contactstorage-593de-default-rtdb.europe-west1.firebasedatabase.app/";
let contactList = [];

// array für kontaktliste wo alle daten + spezifische id gespeichert wird und das laden und bearbeiten einfacher macht

async function onloadFunc() {
  console.log(await loadData());

  await createContactlist();

  renderPhoneList();
}

// Hauptfunktion: Steuert den Sortier- und Renderprozess
function renderPhoneList() {
  const sortedContacts = sortContacts(contactList);
  const groupedContacts = groupContactsByInitial(sortedContacts);
  displayGroupedContacts(groupedContacts);
}

async function createContactlist(){
  let data = await loadData("contact"); // holt mittels dieser funct das Json von der Datenbank unter diesem Pfad

  let contacts = Object.keys(data); // nimmt die keys der jeweiligen objecte zum weiter verarbeiten

  for (let i = 0; i < contacts.length; i++) {
    contactList.push(
      //ein object in das array pushen mit den ganzen informationen
      {
        id: contacts[i], //pusht den jeweiligen key einzeln in das array um extra darauf zuzugreifen
        user: data[contacts[i]], // pusht die values in dem object unter der speziellen id in das array unter user
      }
    );
  }

}

// Sortiert die Kontakte alphabetisch nach dem Namen
function sortContacts(contacts) {
  return contacts.sort((a, b) => a.user.name.localeCompare(b.user.name));
}

// Gruppiert die Kontakte basierend auf ihrem Anfangsbuchstaben
function groupContactsByInitial(contacts) {
  const grouped = {};

  contacts.forEach(contact => {
    const initial = contact.user.name.charAt(0).toUpperCase();
    if (!grouped[initial]) {
      grouped[initial] = [];
    }
    grouped[initial].push(contact);
  });

  return grouped;
}

// Zeigt die gruppierten Kontakte an
function displayGroupedContacts(groupedContacts) {
  const content = document.getElementById("content-contactlist");
  content.innerHTML = "";

  for (const initial in groupedContacts) {
    content.innerHTML += `<h2>${initial}</h2>`;
    groupedContacts[initial].forEach(contact => {
      content.innerHTML += /*html*/ `
        <div>
          <div class="contactlist-name">${contact.user.name}</div>
          <div  class="contactlist-vector"></div>
          <div class="contactlist-mail">${contact.user.mail}</div>
        </div>
      `;
    });
  }
}


// function renderPhoneList() {
//   const content = document.getElementById("content-contactlist");
//   content.innerHTML = "";

//   for (let i = 0; i < contactList.length; i++) {
//     content.innerHTML += /*html*/ `
//       <div>
//         ${contactList[i].user.name}
//         ${contactList[i].user.number}
//         ${contactList[i].user.mail}
//       </div>
//     `;
//   }
// }



function showContactList() {}

async function addContact() {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("email").value;
  let phone = document.getElementById("phonenumber").value;

  let newContact = await addNewContact(name, mail, phone); //function mit neuem kontakt zum hinzufügen  || könnte auch addNewCon weg lassen und mit postData und den namen aus inputfeld arbeiten

  console.log(newContact);

  //let contactID = newContact.name; // newContact gibt ein object zurück in dem sich die spezifische id unter name befindet
}

function deleteContact() {}

async function editContact() {
  // Ändern des Kontakts mittels PUT
  await putData("/contact/" + contactID, {
    name: "Berta",
    number: "9876543210",
  });
  console.log("Kontakt aktualisiert");
}

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
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

function openAddContact() {
  document.getElementById("background-pop-up").classList.remove("d-none");
  document.getElementById("pop-up-contact").classList.remove("d-none");
  document.querySelector("body").classList.add("overflow-hidden");
}

function closeAddContact() {
  document.getElementById("background-pop-up").classList.add("d-none");
  document.getElementById("pop-up-contact").classList.add("d-none");
  document.querySelector("body").classList.remove("overflow-hidden");
}
