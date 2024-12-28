let contactWrapperHTML = ''; // Globale Variable


// array für kontaktliste wo alle daten + spezifische id gespeichert wird und das laden und bearbeiten einfacher macht

async function onloadFunc() {
  // await isUserLoggedIn();  // wenn user nicht eingeloggt ist, wird er auf login Seite weitergeleitet
  await createContactlist();
  renderPhoneList();
  await generateHeaderInitials();
}

// Hauptfunktion: Steuert den Sortier- und Renderprozess
function renderPhoneList() {
  const sortedContacts = sortContacts(contactList);
  groupedContacts = groupContactsByInitial(sortedContacts);
  console.log('groupedContacts', groupedContacts);
  displayGroupedContacts(groupedContacts);
}

async function createContactlist() {
    let data = await loadData("contacts"); // holt mittels dieser Funktion das JSON von der Datenbank unter diesem Pfad
    contactKeys = Object.keys(data); // nimmt die keys der jeweiligen Objekte zum Weiterverarbeiten

    for (let i = 0; i < contactKeys.length; i++) {
      contactList.push({
        id: contactKeys[i], // Speichert den jeweiligen Key als ID
        user: data[contactKeys[i]], // Speichert die User-Daten
        color: data[contactKeys[i]].color, // Speichert die Farbe
      });
    }
    console.log(contactList);
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
// Zeigt die gruppierten Kontakte sortiert nach ihren Initialen an
function displayGroupedContacts(groupedContacts) {
  const content = document.getElementById("content-contactlist");
  content.innerHTML = "";

  // Erstelle einen übergeordneten Container
  let fullContent = '<div class="contacts-wrapper">';

  // Sortiere die Initialen
  const sortedInitials = Object.keys(groupedContacts).sort();

  // Schleife durch die sortierten Initialen und gruppierten Kontakte
  sortedInitials.forEach(initial => {
    fullContent += /*html*/ `
      <div class="contact-group">
        <h2>${initial}</h2>
        <div class="contactlist-vector"></div>
        `;

    groupedContacts[initial].forEach((contact, index) => {
      const initials = getInitials(contact.user.name);
      const contactColor = contact.color; // Verwende die gespeicherte Farbe oder generiere eine neue
      fullContent += /*html*/ `
      <div class="contact-profil">
        <div class="contact-item" onclick="getContactInfo('${initial}', ${index})" tabindex="0">
          <div class="contact-initials" style="background-color: ${contactColor};">${initials}</div>
          <div class="contact-name-mail">
            <div class="contactlist-name">${contact.user.name}</div>
            <div class="contactlist-mail">${contact.user.mail}</div>
          </div>
        </div>
      </div>
      `;
    });
    fullContent += `</div>`;
  });

  fullContent += "</div>";

  content.innerHTML = fullContent;
}

function getContactInfo(groupInitial, contactIndex) {
  const contact = groupedContacts[groupInitial][contactIndex];
  const contactColor = contact.color;

  // Kontaktdaten HTML
  const contactHTML = /*html*/ `
    <div class="info-initial-name">
      <div class="info-initial" style="background-color: ${contactColor};">${contact.user.initials}</div>
      <div class="info-name-button">
        <div class="info-name">${contact.user.name}</div>
        <div class="info-buttons" id="editDeleteButtons">
          <button class="info-edit" onclick="openEditContact('${groupInitial}', ${contactIndex})">
            <img src="/assets/icons/contact/contact_info_edit.png" alt="">
            Edit
          </button>
          <button class="info-delete" onclick="deleteContact('${contact.id}')">
            <img src="/assets/icons/contact/contact_info_delete.png" alt="">
            Delete
          </button>
        </div>
      </div>
    </div>
    <div class="info-text">Contact Information</div>
    <div class="info-email-phone">
      <div class="info-email">
        <span>Email</span>
        <a href="mailto:${contact.user.mail}">${contact.user.mail}</a>
      </div>
      <div class="info-phone">
        <span>Phone</span>
        <span>${contact.user.number}</span>
      </div>
    </div>
  `;

  const contactWrapperHTML = /*html*/ `
    <div id="contact-text-small" class="contact-text">
      <span class="span-1">Contacts</span>
      <div class="contact-vector"></div>
      <span class="span-2">Better with a team</span>
    </div>
    <button onclick="closeContactInfoWindow()" class="back-info-wrapper">
      <img src="../assets/icons/arrow_left_line.svg" alt="button-back">
    </button>
    <div class="contact-info-wrapper">
      ${contactHTML}
    </div>
    <button id="toggleButtons">
      <img src="../assets/icons/contact/more_vert.png" alt="">
    </button>
  `;

function renderContactInfo() {
  const popup = document.getElementById("contact-info-window");
  const contactInfo = document.getElementById("contact-info");
  const contactListField = document.getElementById("contact-list-field");

  if (!popup || !contactInfo || !contactListField) {
    console.error("Wichtige DOM-Elemente fehlen!");
    return;
  }

  if (window.innerWidth <= 850) {
    // Zeige im Popup-Fenster
    popup.innerHTML = contactWrapperHTML;
    popup.classList.remove("d-none");
    contactListField.classList.add("d-none");
    contactInfo.innerHTML = ""; // Hauptbereich leeren

    // Buttons verschieben nach dem Einfügen des HTML
    moveButtons();
  } else {
    // Zeige im Hauptbereich
    contactInfo.innerHTML = contactHTML;
    popup.classList.add("d-none"); // Popup verstecken
    contactListField.classList.remove("d-none");

    // Buttons verschieben nach dem Einfügen des HTML
    moveButtons();
  }

  // Event-Listener für den Toggle-Button hinzufügen
  const toggleButton = document.getElementById("toggleButtons");
  if (toggleButton) {
    // Vorherige Event-Listener entfernen, um doppelte Hinzufügungen zu vermeiden
    toggleButton.removeEventListener("click", toggleEditDelete);
    toggleButton.addEventListener("click", toggleEditDelete);
  } else {
    console.warn("toggleButton existiert nicht.");
  }
}
// Initial render
renderContactInfo();

// Event-Listener für Resize hinzufügen
window.addEventListener("resize", renderContactInfo);
}
// Schließen des Popups
function closeContactInfoWindow() {
  document.getElementById("contact-list-field").classList.remove("d-none");
  document.getElementById("contact-info-window").classList.add("d-none");
}








async function addContact(button) {
  // Referenz auf das Formular
  let form = document.querySelector("form");

  // Überprüfe, ob das Formular gültig ist
  if (!form.checkValidity()) {
    // HTML5-Validierung schlägt fehl, der Browser zeigt eine Fehlermeldung an
    form.reportValidity(); // Zeigt die entsprechenden Fehlermeldungen für die ungültigen Felder an
    return; // Verhindert das Fortfahren der Funktion
  }
  button.disabled = true;

  let name = document.getElementById("name").value;
  let mail = document.getElementById("email").value;
  let phone = document.getElementById("phonenumber").value;

  try {
    // Füge den Kontakt hinzu (warte auf Abschluss, aber prüfe den Rückgabewert nicht)
    await addNewContact(name, mail, phone);

    // Erfolgsmeldung anzeigen und Liste neu rendern
    document.getElementById("success-message").classList.remove("d-none");

    // Inputfelder leeren
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phonenumber").value = "";

    // Aktualisiere die Kontaktliste
    contactList = []; // Leere die vorhandene Liste
    await createContactlist(); // Lade die Kontakte erneut
    renderPhoneList(); // Render die aktualisierte Liste

    closeAddContact();

    setTimeout(() => {
      document.getElementById("success-message").classList.add("d-none");
    }, 3000);
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Kontakts:", error);
  } finally {
    button.disabled = false;
  }
}

// Hilfsfunktion, um die Initialen zu extrahieren
function getInitials(fullName) {
  const nameParts = fullName.split(" "); // Teilt den Namen in Vor- und Nachname
  const firstInitial = nameParts[0]?.charAt(0).toUpperCase(); // Erste Initiale
  const lastInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : ""; // Zweite Initiale, falls vorhanden
  return `${firstInitial}${lastInitial}`; // Kombiniere Initialen
}

async function addNewContact(name, mail, number) {
  // Berechne die Initialen basierend auf dem Namen
  const initials = getInitials(name);

  // Generiere eine zufällige Hintergrundfarbe
  const color = getRandomColor();

  // Speichere die Daten, einschließlich der Initialen und der Farbe, in der Datenbank
  await postData("/contacts", {
    name: name,
    mail: mail,
    number: number,
    initials: initials, // Initialen hinzufügen
    color: color, // Hintergrundfarbe hinzufügen
  });
}

function openAddContact() {
  console.log("animationend fired");
  document.getElementById("background-pop-up").classList.remove("d-none");
  document.getElementById("pop-up-add-contact").classList.remove("d-none", "slide-out");
  document.querySelector("body").classList.add("overflow-hidden");

}

function closeAddContact() {
  document.getElementById("background-pop-up").classList.add("d-none");
  document.getElementById("pop-up-add-contact").classList.add("d-none");
  document.querySelector("body").classList.remove("overflow-hidden");
}

function openEditContact(groupedcontact, index) {
  document.getElementById("pop-up-edit-contact").classList.remove("d-none");
  document.getElementById("background-pop-up").classList.remove("d-none");
  document.querySelector("body").classList.add("overflow-hidden");

  renderEditContact(groupedcontact, index);
}

function closeEditContact() {
  document.getElementById("pop-up-edit-contact").classList.add("d-none");
  document.getElementById("background-pop-up").classList.add("d-none");
  document.querySelector("body").classList.remove("overflow-hidden");
}

// Funktion zur Generierung einer zufälligen Hex-Farbe
function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function renderEditContact(groupedcontact, index) {
  const contact = groupedContacts[groupedcontact][index];
  const contactColor = contact.color;
  console.log(contact.user.name);

  document.getElementById("edit-contact-picture").innerHTML = /*html*/ `
    <div class="edit-contact-pic"  style="background-color: ${contactColor};">${contact.user.initials}</div>
  `;

  document.getElementById("edit-name").value = contact.user.name;
  document.getElementById("edit-email").value = contact.user.mail;
  document.getElementById("edit-phonenumber").value = contact.user.number;
  document.getElementById("edit-delete").value = contact.id;
  document.getElementById("edit-save").value = contact.id;

  //gibt dem 2. button keine id
}

async function deleteContact(id) {
  await deleteData("/contacts/" + id);

  // Aktualisiere die Kontaktliste
  contactList = []; // Leere die vorhandene Liste
  await createContactlist(); // Lade die Kontakte erneut
  renderPhoneList(); // Render die aktualisierte Liste

  document.getElementById("contact-info").innerHTML = "";
}

async function editContact(id) {
  console.log(id);

  let name = document.getElementById("edit-name").value;
  let mail = document.getElementById("edit-email").value;
  let number = document.getElementById("edit-phonenumber").value;
  // Aktuelle Daten abrufen
  let existingData = await loadData("/contacts/" + id);

  // Nur die Felder aktualisieren, die geändert wurden
  let updatedData = {
    ...existingData, // Spread-Operator: Kopiert alle Eigenschaften von existingData in das neue Objekt
    name: name, // Überschreibt oder fügt die `name`-Eigenschaft hinzu
    mail: mail, // Überschreibt oder fügt die `mail`-Eigenschaft hinzu
    number: number, // Überschreibt oder fügt die `number`-Eigenschaft hinzu
  };

  // Dann PUT-Request mit dem aktualisierten Datensatz senden
  await putData("/contacts/" + id, updatedData);

  closeEditContact();
  contactList = []; // Leere die vorhandene Liste
  await createContactlist(); // Lade die Kontakte erneut
  renderPhoneList(); // Render die aktualisierte Liste
  document.getElementById("contact-info").innerHTML = "";
}


function toggleEditDelete() {
  const movedButtonsContainer = document.getElementById('movedButtons');
  if (!movedButtonsContainer) {
    console.warn("toggleEditDelete: 'movedButtons' existiert nicht.");
    return;
  }

  // Toggle Sichtbarkeit
  if (movedButtonsContainer.style.display === 'none' || movedButtonsContainer.style.display === '') {
    movedButtonsContainer.style.display = 'flex'; // Buttons anzeigen
  } else {
    movedButtonsContainer.style.display = 'none'; // Buttons ausblenden
  }
}



function moveButtons() {
  const contactInfoWindow = document.getElementById('contact-info-window');
  if (!contactInfoWindow) {
    console.warn("moveButtons: 'contact-info-window' existiert nicht.");
    return;
  }

  let movedButtonsContainer = document.getElementById('movedButtons');
  if (!movedButtonsContainer) {
    movedButtonsContainer = document.createElement('div');
    movedButtonsContainer.id = 'movedButtons';
    movedButtonsContainer.style.display = 'none'; // Standardmäßig versteckt
    contactInfoWindow.appendChild(movedButtonsContainer);
  }

  const editDeleteButtons = document.getElementById('editDeleteButtons');
  if (!editDeleteButtons) {
    console.warn("moveButtons: 'editDeleteButtons' existiert nicht.");
    return;
  }

  // Verschieben
  while (editDeleteButtons.firstChild) {
    movedButtonsContainer.appendChild(editDeleteButtons.firstChild);
  }

  // Ursprüngliches Element ausblenden
  editDeleteButtons.style.display = 'none';
}






document.addEventListener('DOMContentLoaded', () => {
  const contactInfoWindow = document.getElementById('contact-info-window');
  if (contactInfoWindow) {
    contactInfoWindow.innerHTML = contactWrapperHTML; // Füge den HTML-Code ein
  }
  
  // Initiales Verschieben
  moveButtons();
  
  // Toggle-Button-Klick
  document.getElementById('toggleButtons').addEventListener('click', () => {
    toggleEditDelete(); // Buttons ein-/ausblenden
    moveButtons(); // Nach dem Umschalten verschieben
  });
  
  // Event Listener für Fenstergröße
  window.addEventListener('resize', moveButtons);
});
