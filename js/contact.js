const BASE_URL =
  "https://contactstorage-593de-default-rtdb.europe-west1.firebasedatabase.app/";
let contactList = [];

// array für kontaktliste wo alle daten + spezifische id gespeichert wird und das laden und bearbeiten einfacher macht

async function onloadFunc() {
  console.log(await loadData());

  await createContactlist();

  renderPhoneList();

  setRandomBackgrounds()
}

// Hauptfunktion: Steuert den Sortier- und Renderprozess
function renderPhoneList() {
  const sortedContacts = sortContacts(contactList);
  const groupedContacts = groupContactsByInitial(sortedContacts);
  displayGroupedContacts(groupedContacts);
}

async function createContactlist() {
  let data = await loadData("contacts"); // holt mittels dieser funct das Json von der Datenbank unter diesem Pfad

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

  // Erstelle einen übergeordneten Container
  let fullContent = '<div class="contacts-wrapper">';

  // Schleife durch die gruppierten Kontakte
  for (const initial in groupedContacts) {
    fullContent += /*html*/ `
      <div class="contact-group">
        <h2>${initial}</h2>
        <div class="contactlist-vector"></div>
        `;

    groupedContacts[initial].forEach(contact => {
      const initials = getInitials(contact.user.name);
      fullContent += /*html*/ `
        <div class="contact-item">
          <div class="contact-initials">${contact.user.initials}</div>
          <div class="contact-name-mail">
            <div class="contactlist-name">${contact.user.name}</div>
            <a href="mailto:${contact.user.mail}" class="contactlist-mail">${contact.user.mail}</a>
        </div>
      `;
    });

    // Schließe die Kontaktgruppe ab
    fullContent += `</div>`;
  }

  // Schließe den übergeordneten Container
  fullContent += "</div>";

  // Füge den gesamten HTML-Inhalt in einem Schritt ein
  content.innerHTML = fullContent;
}

function showContactList() {}

async function addContact() {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("email").value;
  let phone = document.getElementById("phonenumber").value;

  await addNewContact(name, mail, phone); //function mit neuem kontakt zum hinzufügen  || könnte auch addNewCon weg lassen und mit postData und den namen aus inputfeld arbeiten
  // Falls erfolgreich, zeige die Nachricht
  if (addNewContact()) {
    document.getElementById("success-message").classList.remove('d-none');

    // Optionale Funktion, um die Nachricht nach 3 Sekunden wieder auszublenden
    setTimeout(() => {
      document.getElementById("success-message").classList.add('d-none');
    }, 3000);
  }
}

function deleteContact() {}

async function editContact() {
  // Ändern des Kontakts mittels PUT
  await putData("/contacts/" + contactID, {
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

// Hilfsfunktion, um die Initialen zu extrahieren
function getInitials(fullName) {
  const nameParts = fullName.split(" "); // Teilt den Namen in Vor- und Nachname
  const firstInitial = nameParts[0]?.charAt(0).toUpperCase(); // Erste Initiale
  const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || ""; // Zweite Initiale, falls vorhanden
  return `${firstInitial}${lastInitial}`; // Kombiniere Initialen
}

async function addNewContact(name, mail, number) {
  // Berechne die Initialen basierend auf dem Namen
  const initials = getInitials(name);

  // Speichere die Daten, einschließlich der Initialen, in der Datenbank
  await postData("/contacts", {
    name: name,
    mail: mail,
    number: number,
    initials: initials, // Initialen hinzufügen
  });
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



// Funktion zur Generierung einer zufälligen Hex-Farbe
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Funktion zum Setzen der zufälligen Hintergrundfarbe für alle Elemente mit der Klasse "contact-initials"
function setRandomBackgrounds() {
  let elements = document.querySelectorAll('.contact-initials');
  elements.forEach(element => {
      let randomColor = getRandomColor();
      element.style.backgroundColor = randomColor;
  });
}
