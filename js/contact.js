let contactWrapperHTML = ''; // Globale Variable
let contactInfo;
let currentGroupInitial;
let currentContactIndex;


// array für kontaktliste wo alle daten + spezifische id gespeichert wird und das laden und bearbeiten einfacher macht

async function onloadFunc() {
  // await isUserLoggedIn();  // wenn user nicht eingeloggt ist, wird er auf login Seite weitergeleitet
  await createContactlist();
  renderPhoneList();
  await generateHeaderInitials();

  await loadTodosArray();
  currentTodos = JSON.parse(JSON.stringify(todos));
}

// Hauptfunktion: Steuert den Sortier- und Renderprozess
function renderPhoneList() {
  const sortedContacts = sortContacts(contactList);
  groupedContacts = groupContactsByInitial(sortedContacts);
  console.log('groupedContacts', groupedContacts);
  displayGroupedContacts(groupedContacts);
}

async function createContactlist() {
  let data = await loadData('contacts'); // holt mittels dieser Funktion das JSON von der Datenbank unter diesem Pfad

  if (!data || Object.keys(data).length === 0) {
    // Überprüft, ob die Daten leer oder undefined sind
    console.log('Keine Kontakte vorhanden.');
    contactList = []; // Kontaktliste bleibt leer
  } else {
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
}

// Sortiert die Kontakte alphabetisch nach dem Namen
function sortContacts(contacts) {
  return contacts.sort((a, b) => a.user.name.localeCompare(b.user.name));
}

// Gruppiert die Kontakte basierend auf ihrem Anfangsbuchstaben
function groupContactsByInitial(contacts) {
  const grouped = {};

  contacts.forEach((contact) => {
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
function generateFullContentHTML(initial, contact, index) {
  const initials = contact?.user?.initials || '??'; // Initialen aus dem `user`-Objekt
  const contactColor = contact?.color || '#CCCCCC'; // Standardfarbe verwenden

  return /*html*/ `
    <div class="contact-profil">
      <div class="contact-item" onclick="getContactInfo('${initial}', ${index})" tabindex="0">
        <div class="contact-initials" style="background-color: ${contactColor};">${initials}</div>
        <div class="contact-name-mail">
          <div class="contactlist-name">${contact?.user?.name || 'Unbekannt'}</div>
          <div class="contactlist-mail">${contact?.user?.mail || 'Keine E-Mail'}</div>
        </div>
      </div>
    </div>
  `;
}


function displayGroupedContacts(groupedContacts) {
  const content = document.getElementById('content-contactlist');
  content.innerHTML = '';

  // Erstelle einen übergeordneten Container
  let fullContent = '<div class="contacts-wrapper">';

  // Sortiere die Initialen
  const sortedInitials = Object.keys(groupedContacts).sort();

  // Schleife durch die sortierten Initialen und gruppierten Kontakte
  sortedInitials.forEach((initial) => {
    fullContent += /*html*/ `
      <div class="contact-group">
        <h2>${initial}</h2>
        <div class="contactlist-vector"></div>
    `;

    groupedContacts[initial].forEach((contact, index) => {
      fullContent += generateFullContentHTML(initial, contact, index);
    });

    fullContent += `</div>`;
  });

  fullContent += '</div>';
  content.innerHTML = fullContent;
}


function generateContactHtml(groupInitial, contactIndex, contact, contactColor) {
  // Prüfen, ob die flache Struktur vorhanden ist
  const initials = contact.user?.initials || contact.initials;
  const name = contact.user?.name || contact.name;
  const mail = contact.user?.mail || contact.mail;
  const number = contact.user?.number || contact.number;

  if (!initials || !name || !mail || !number) {
    console.error('Fehler: Kontakt oder Kontaktinformationen fehlen.', contact);
    return '<div class="error">Kontaktinformationen fehlen</div>';
  }

  return /*html*/ `
  <div class="info-initial-name">
    <div class="info-initial" style="background-color: ${contactColor};">${initials}</div>
    <div class="info-name-button">
      <div class="info-name">${name}</div>
      <div class="info-buttons" id="editDeleteButtons">
        <button class="info-edit blue-btn-hover" onclick="openEditContact('${groupInitial}', ${contactIndex})">
          <img class="selected-contact-img" src="/assets/icons/contact/contact_info_edit.png" alt="">
          Edit
        </button>
        <button class="info-delete blue-btn-hover" onclick="deleteContact('${contact.id}')">
          <img class="selected-contact-img" src="/assets/icons/contact/contact_info_delete.png" alt="">
          Delete
        </button>
      </div>
    </div>
  </div>
  <div class="info-text">Contact Information</div>
  <div class="info-email-phone">
    <div class="info-email">
      <span>Email</span>
      <a href="mailto:${mail}">${mail}</a>
    </div>
    <div class="info-phone">
      <span>Phone</span>
      <span>${number}</span>
    </div>
  </div>
  `;
}




function generateContactWrapperHtml(contactHTML){
  return /*html*/ `
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
`
}


// Ausgelagerte renderContactInfo-Funktion
function renderContactInfo(contactHTML, contactWrapperHTML) {
  const popup = document.getElementById('contact-info-window');
  contactInfo = document.getElementById('contact-info');
  const contactListField = document.getElementById('contact-list-field');

  if (!popup || !contactInfo || !contactListField) {
    console.error('Wichtige DOM-Elemente fehlen!');
    return;
  }

  if (window.innerWidth <= 850) {
    // Zeige im Popup-Fenster
    popup.innerHTML = contactWrapperHTML;
    popup.classList.remove('d-none');
    contactListField.classList.add('d-none');
    contactInfo.innerHTML = ''; // Hauptbereich leeren

    // Buttons verschieben nach dem Einfügen des HTML
    moveButtons();
  } else {
    // Zeige im Hauptbereich
    contactInfo.innerHTML = contactHTML;
    popup.classList.add('d-none'); // Popup verstecken
    contactListField.classList.remove('d-none');
  }

  generateEventListenerToggleButtons();
}

function generateEventListenerToggleButtons() {
  // Event-Listener für den Toggle-Button hinzufügen
  const toggleButton = document.getElementById('toggleButtons');
  if (toggleButton) {
    // Vorherige Event-Listener entfernen, um doppelte Hinzufügungen zu vermeiden
    toggleButton.removeEventListener('click', toggleEditDelete);
    toggleButton.addEventListener('click', toggleEditDelete);
  } else {
    console.warn('toggleButton existiert nicht.');
  }
}


function transformContact(contact) {
  if (!contact) return null;

  return {
    id: contact.id,
    color: contact.color,
    user: {
      initials: contact.initials,
      name: contact.name,
      mail: contact.mail,
      number: contact.number,
    },
  };
}


// Hauptfunktion mit Aufruf der ausgelagerten Funktion
function getContactInfo(groupInitial, contactIndex) {
  currentGroupInitial = groupInitial;
  currentContactIndex = contactIndex;

  const group = groupedContacts[groupInitial];
  if (!group || group.length === 0) {
    console.error(`Gruppe ${groupInitial} existiert nicht oder ist leer.`);
    return;
  }

  if (contactIndex < 0 || contactIndex >= group.length) {
    console.error(`Kontakt mit Index ${contactIndex} in Gruppe ${groupInitial} existiert nicht.`);
    console.log('Aktuelle Gruppe:', group);
    return;
  }

  const contact = group[contactIndex];
  if (!contact) {
    console.error(`Kontakt mit Index ${contactIndex} in Gruppe ${groupInitial} ist undefined.`);
    return;
  }

  const contactColor = contact.color || '#CCCCCC';
  const contactHTML = generateContactHtml(groupInitial, contactIndex, contact, contactColor);
  const contactWrapperHTML = generateContactWrapperHtml(contactHTML);

  renderContactInfo(contactHTML, contactWrapperHTML);
  window.addEventListener('resize', () => renderContactInfo(contactHTML, contactWrapperHTML));
}






// Schließen des Popups
function closeContactInfoWindow() {
  document.getElementById('contact-list-field').classList.remove('d-none');
  document.getElementById('contact-info-window').classList.add('d-none');
}

async function addContact(button) {
  // Referenz auf das Formular
  let form = document.querySelector('form');

  // Überprüfe, ob das Formular gültig ist
  if (!form.checkValidity()) {
    // HTML5-Validierung schlägt fehl, der Browser zeigt eine Fehlermeldung an
    form.reportValidity(); // Zeigt die entsprechenden Fehlermeldungen für die ungültigen Felder an
    return; // Verhindert das Fortfahr<<en der Funktion
  }
  button.disabled = true;

  let name = document.getElementById('name').value;
  let mail = document.getElementById('email').value;
  let phone = document.getElementById('phonenumber').value;

  try {
    // Füge den Kontakt hinzu (warte auf Abschluss, aber prüfe den Rückgabewert nicht)
    await addNewContact(name, mail, phone);

    // Erfolgsmeldung anzeigen und Liste neu rendern
    document.getElementById('success-message').classList.remove('d-none');

    // Inputfelder leeren
    name = '';
    mail = '';
    phone = '';

    // Aktualisiere die Kontaktliste
    await updateContactlist();

    closeAddContact();

    setTimeout(() => {
      document.getElementById('success-message').classList.add('d-none');
    }, 3000);
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Kontakts:', error);
  } finally {
    button.disabled = false;
  }
}

async function updateContactlist() {
  contactList = []; // Leere die vorhandene Liste
  await createContactlist(); // Lade die Kontakte erneut
  renderPhoneList(); // Render die aktualisierte Liste
}

// Hilfsfunktion, um die Initialen zu extrahieren
function getInitials(fullName) {
  const nameParts = fullName.split(' '); // Teilt den Namen in Vor- und Nachname
  const firstInitial = nameParts[0]?.charAt(0).toUpperCase(); // Erste Initiale
  const lastInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : ''; // Zweite Initiale, falls vorhanden
  return `${firstInitial}${lastInitial}`; // Kombiniere Initialen
}

async function addNewContact(name, mail, number) {
  // Berechne die Initialen basierend auf dem Namen
  const initials = getInitials(name);

  // Generiere eine zufällige Hintergrundfarbe
  const color = getRandomColor();

  // Speichere die Daten, einschließlich der Initialen und der Farbe, in der Datenbank
  await postData('/contacts', {
    name: name,
    mail: mail,
    number: number,
    initials: initials, // Initialen hinzufügen
    color: color, // Hintergrundfarbe hinzufügen
  });
}

function openAddContact() {
  console.log('animationend fired');
  document.getElementById('background-pop-up').classList.remove('d-none');
  document.getElementById('pop-up-add-contact').classList.remove('d-none', 'slide-out');
  document.querySelector('body').classList.add('overflow-hidden');
}

function closeAddContact() {
  document.getElementById('background-pop-up').classList.add('d-none');
  document.getElementById('pop-up-add-contact').classList.add('d-none');
  document.querySelector('body').classList.remove('overflow-hidden');
}

function openEditContact(groupedcontact, index) {
  currentGroupInitial = groupedcontact;
  currentContactIndex = index;

  document.getElementById('pop-up-edit-contact').classList.remove('d-none');
  document.getElementById('background-pop-up').classList.remove('d-none');
  document.querySelector('body').classList.add('overflow-hidden');

  renderEditContact(groupedcontact, index);
}

function closeEditContact() {
  document.getElementById('pop-up-edit-contact').classList.add('d-none');
  document.getElementById('background-pop-up').classList.add('d-none');
  document.querySelector('body').classList.remove('overflow-hidden');
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

function renderEditContact(groupedcontact, index) {
  const contact = groupedContacts[groupedcontact][index];
  const contactColor = contact.color;
  console.log(contact.user.name);

  document.getElementById('edit-contact-picture').innerHTML = /*html*/ `
    <div class="edit-contact-pic"  style="background-color: ${contactColor};">${contact.user.initials}</div>
  `;

  document.getElementById('edit-name').value = contact.user.name;
  document.getElementById('edit-email').value = contact.user.mail;
  document.getElementById('edit-phonenumber').value = contact.user.number;
  document.getElementById('edit-delete').value = contact.id;
  document.getElementById('edit-save').value = contact.id;
}

async function deleteContact(id) {
  try {
    // Kontakt aus der Datenbank löschen
    await deleteData('/contacts/' + id);

    // Kontakt aus allen Todos entfernen
    await deleteContactRemote(id);

    // Aktualisiere die Kontaktliste
    await updateContactlist();


    document.getElementById('contact-info').innerHTML = '';
    closeContactInfoWindow();
  } catch (error) {
    console.error('Fehler beim Löschen des Kontakts:', error);
  }
}


async function editContact(id) {
  console.log(id);

  const { name, mail, number } = getUpdatedContactData();
  const existingData = await loadData('/contacts/' + id);

  if (!validateInitials(existingData)) return;

  const updatedData = createUpdatedContact(existingData, name, mail, number);
  await updateGroupedContacts(existingData, updatedData, id);
  await putData('/contacts/' + id, updatedData);

  finalizeEdit(id, updatedData);
  console.log(updatedData);
}

function getUpdatedContactData() {
  return {
    name: document.getElementById('edit-name').value,
    mail: document.getElementById('edit-email').value,
    number: document.getElementById('edit-phonenumber').value,
  };
}

function validateInitials(existingData) {
  if (!existingData.initials || existingData.initials.length < 1) {
    console.error('Fehler: Initialen des bestehenden Kontakts sind nicht definiert.');
    return false;
  }
  return true;
}

function createUpdatedContact(existingData, name, mail, number) {
  const [firstName, lastName] = name.split(' ');
  const initials = (firstName[0] + lastName[0]).toUpperCase();
  return {
    ...existingData,
    name,
    mail,
    number,
    initials,
  };
}

async function updateGroupedContacts(existingData, updatedData, id) {
  const oldInitial = existingData.initials[0];
  const newInitial = updatedData.initials[0];

  if (existingData.initials !== updatedData.initials) {
    if (groupedContacts[oldInitial]) {
      groupedContacts[oldInitial] = groupedContacts[oldInitial].filter(contact => contact.id !== id);
    } else {
      console.warn(`Gruppe ${oldInitial} existiert nicht. Kein Entfernen notwendig.`);
    }

    if (!groupedContacts[newInitial]) groupedContacts[newInitial] = [];
    groupedContacts[newInitial].push(updatedData);
  } else {
    updateContactInSameGroup(existingData, updatedData, id, oldInitial);
  }
}

function updateContactInSameGroup(existingData, updatedData, id, groupInitial) {
  const group = groupedContacts[groupInitial];
  if (group) {
    const contactIndex = group.findIndex(contact => contact.id === id);
    if (contactIndex !== -1) {
      group[contactIndex] = updatedData;
    } else {
      console.error(`Kontakt mit ID ${id} nicht in Gruppe ${groupInitial} gefunden.`);
    }
  } else {
    console.error(`Gruppe ${groupInitial} existiert nicht.`);
  }
}

function removeDuplicates(group) {
  return group.filter((contact, index, self) =>
    index === self.findIndex(c => c.id === contact.id)
  );
}

function finalizeEdit(id, updatedData) {
  updateLocalContactList(id, updatedData);
  updateContactlist();
  closeEditContact();

  document.getElementById('contact-info').innerHTML = '';

  const newInitial = updatedData.initials[0];
  const newGroup = groupedContacts[newInitial];

  if (!newGroup || newGroup.length === 0) {
    console.error(`Gruppe ${newInitial} ist leer oder existiert nicht.`);
    return;
  }

  // Suche den Index des Kontakts
  const newIndex = newGroup.findIndex(contact => contact.id === id);
  if (newIndex === -1) {
    console.error(`Kontakt mit ID ${id} konnte in Gruppe ${newInitial} nicht gefunden werden.`);
    console.log('Aktuelle Gruppe:', newGroup);
    return;
  }

  currentGroupInitial = newInitial;
  currentContactIndex = newIndex;

  console.log(`Kontakt erfolgreich in Gruppe ${newInitial} gefunden.`);
  getContactInfo(currentGroupInitial, currentContactIndex);
}







function updateLocalContactList(id, updatedData) {
  console.log('Vorherige groupedContacts:', JSON.stringify(groupedContacts, null, 2));

  // Entferne den Kontakt aus allen Gruppen
  Object.keys(groupedContacts).forEach(groupKey => {
    groupedContacts[groupKey] = groupedContacts[groupKey].filter(contact => contact.id !== id);
  });

  // Füge den Kontakt in die neue Gruppe ein
  const newInitial = updatedData.initials[0];
  if (!groupedContacts[newInitial]) {
    groupedContacts[newInitial] = [];
  }

  const exists = groupedContacts[newInitial].some(contact => contact.id === id);
  if (!exists) {
    groupedContacts[newInitial].push({
      id,
      ...updatedData,
    });
  }

  // Debugging: Aktueller Zustand
  console.log('Nachher groupedContacts:', JSON.stringify(groupedContacts, null, 2));
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

async function deleteContactRemote(id) {
  const updates = {}; // Sammle alle Änderungen in einem Objekt

  currentTodos.forEach((todo, index) => {
    // Überprüfen, ob `assignedTo` existiert, sonst als leeres Array initialisieren
    const assignedTo = todo.assignedTo || [];

    // Prüfen, ob die Kontakt-ID im `assignedTo`-Array enthalten ist
    if (assignedTo.includes(id)) {
      // Entferne die ID aus der `assignedTo`-Liste
      todo.assignedTo = assignedTo.filter((contactId) => contactId !== id);

      // Speichere die aktualisierte Liste im Updates-Objekt
      updates[`todos/${todoKeysArray[index]}/assignedTo`] = todo.assignedTo;
    }
  });

  // Sende alle Änderungen in einem einzigen PATCH-Request an die Datenbank
  if (Object.keys(updates).length > 0) {
    try {
      await patchData('', updates); // Patch die Änderungen in Firebase
      console.log('AssignedTo-Liste erfolgreich aktualisiert:', updates);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Todos:', error);
    }
  } else {
    console.log('Keine Todos betroffen.');
  }
}




//js anpassen, editcontact fehler beim speichern fixen, slideshow
//js funktion update contactInfo erstellen für abschluss bei editcontact?
