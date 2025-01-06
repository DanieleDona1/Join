let contactWrapperHTML = ''; 
let contactInfo;
let currentGroupInitial;
let currentContactIndex;


async function onloadFunc() {
  await createContactlist();
  renderPhoneList();
  await generateHeaderInitials();
  await loadTodosArray();
  currentTodos = JSON.parse(JSON.stringify(todos));
}


function renderPhoneList() {
  const sortedContacts = sortContacts(contactList);
  groupedContacts = groupContactsByInitial(sortedContacts);
  displayGroupedContacts(groupedContacts);
}


async function createContactlist() {
  let data = await loadData('contacts'); 
  if (!data || Object.keys(data).length === 0) {
    contactList = []; 
  } else {
    contactKeys = Object.keys(data); 
    for (let i = 0; i < contactKeys.length; i++) {
      contactList.push({
        id: contactKeys[i], 
        user: data[contactKeys[i]], 
        color: data[contactKeys[i]].color, 
      });
    }
  }
}


function sortContacts(contacts) {
  return contacts.sort((a, b) => a.user.name.localeCompare(b.user.name));
}


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



function generateFullContentHTML(initial, contact, index) {
  const initials = contact?.user?.initials || '??'; 
  const contactColor = contact?.color || '#CCCCCC'; 

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

  let fullContent = '<div class="contacts-wrapper">';

  const sortedInitials = Object.keys(groupedContacts).sort();

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
          <img class="selected-contact-img" src="../assets/icons/contact/contact_info_edit.png" alt="">
          Edit
        </button>
        <button class="info-delete blue-btn-hover" onclick="deleteContact('${contact.id}')">
          <img class="selected-contact-img" src="../assets/icons/contact/contact_info_delete.png" alt="">
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


function renderContactInfo(contactHTML, contactWrapperHTML) {
  const popup = document.getElementById('contact-info-window');
  contactInfo = document.getElementById('contact-info');
  const contactListField = document.getElementById('contact-list-field');

  if (!popup || !contactInfo || !contactListField) {
    console.error('Wichtige DOM-Elemente fehlen!');
    return;
  }

  if (window.innerWidth <= 850) {
    popup.innerHTML = contactWrapperHTML;
    popup.classList.remove('d-none');
    contactListField.classList.add('d-none');
    contactInfo.innerHTML = ''; 

    moveButtons();
  } else {
    contactInfo.innerHTML = contactHTML;
    popup.classList.add('d-none'); 
    contactListField.classList.remove('d-none');
  }

  generateEventListenerToggleButtons();
}

function generateEventListenerToggleButtons() {
  const toggleButton = document.getElementById('toggleButtons');
  if (toggleButton) {
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


function closeContactInfoWindow() {
  document.getElementById('contact-list-field').classList.remove('d-none');
  document.getElementById('contact-info-window').classList.add('d-none');
}

async function addContact(button) {
  let form = document.querySelector('form');

  if (!form.checkValidity()) {
    form.reportValidity(); 
    return; 
  }
  button.disabled = true;

  let name = document.getElementById('name').value;
  let mail = document.getElementById('email').value;
  let phone = document.getElementById('phonenumber').value;

  try {

    await addNewContact(name, mail, phone);

    document.getElementById('success-message').classList.remove('d-none');

    name = '';
    mail = '';
    phone = '';

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
  contactList = []; 
  await createContactlist(); 
  renderPhoneList(); 
}


function getInitials(fullName) {
  const nameParts = fullName.split(' '); 
  const firstInitial = nameParts[0]?.charAt(0).toUpperCase(); 
  const lastInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : ''; 
  return `${firstInitial}${lastInitial}`; 
}


async function addNewContact(name, mail, number) {
  const initials = getInitials(name);
  const color = getRandomColor();

  await postData('/contacts', {
    name: name,
    mail: mail,
    number: number,
    initials: initials, 
    color: color, 
  });
}


function openAddContact() {
  document.getElementById('background-pop-up').classList.remove('d-none');
  document.getElementById('pop-up-add-contact').classList.remove('d-none', 'slide-out');
  document.querySelector('body').classList.add('overflow-hidden');
}


function closeAddContact() {
  let popupAddContact = document.getElementById('pop-up-add-contact');
  popupAddContact.classList.add('slide-out');
  popupAddContact.addEventListener(
    'animationend',
    function () {
      document.getElementById('background-pop-up').classList.add('d-none');
      popupAddContact.classList.add('slide-out');
      popupAddContact.classList.add('d-none');
      document.querySelector('body').classList.remove('overflow-hidden');
    },
    { once: true }
  );
}


function openEditContact(groupedcontact, index) {
  currentGroupInitial = groupedcontact;
  currentContactIndex = index;

  document.getElementById('background-pop-up').classList.remove('d-none');
  document.getElementById('pop-up-edit-contact').classList.remove('d-none', 'slide-out');
  document.querySelector('body').classList.add('overflow-hidden');

  renderEditContact(groupedcontact, index);
}


function closeEditContact() {
  let popupEditContact = document.getElementById('pop-up-edit-contact');
  popupEditContact.classList.add('slide-out');
  popupEditContact.addEventListener(
    'animationend',
    function () {
        document.getElementById('pop-up-edit-contact').classList.add('d-none');
        document.getElementById('background-pop-up').classList.add('d-none');
        document.querySelector('body').classList.remove('overflow-hidden');
    },
    { once: true }
  );
}


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
    await deleteData('/contacts/' + id);
    await deleteContactRemote(id);
    await updateContactlist();

    document.getElementById('contact-info').innerHTML = '';
    closeContactInfoWindow();
  } catch (error) {
    console.error('Fehler beim Löschen des Kontakts:', error);
  }
}


async function editContact(id) {
  const { name, mail, number } = getUpdatedContactData();
  const existingData = await loadData('/contacts/' + id);

  if (!validateInitials(existingData)) return;

  const updatedData = createUpdatedContact(existingData, name, mail, number);
  await updateGroupedContacts(existingData, updatedData, id);
  await putData('/contacts/' + id, updatedData);

  finalizeEdit(id, updatedData);
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


function removeDuplicates(group) {
  return group.filter((contact, index, self) =>
    index === self.findIndex(c => c.id === contact.id)
  );
}


function toggleEditDelete() {
  const movedButtonsContainer = document.getElementById('movedButtons');
  if (!movedButtonsContainer) {
    console.warn("toggleEditDelete: 'movedButtons' existiert nicht.");
    return;
  }

  if (movedButtonsContainer.style.display === 'none' || movedButtonsContainer.style.display === '') {
    movedButtonsContainer.style.display = 'flex'; 
  } else {
    movedButtonsContainer.style.display = 'none'; 
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
    movedButtonsContainer.style.display = 'none'; 
    contactInfoWindow.appendChild(movedButtonsContainer);
  }

  const editDeleteButtons = document.getElementById('editDeleteButtons');
  if (!editDeleteButtons) {
    console.warn("moveButtons: 'editDeleteButtons' existiert nicht.");
    return;
  }

 
  while (editDeleteButtons.firstChild) {
    movedButtonsContainer.appendChild(editDeleteButtons.firstChild);
  }

 
  editDeleteButtons.style.display = 'none';
}


async function deleteContactRemote(id) {
  const updates = {}; 

  currentTodos.forEach((todo, index) => {
    const assignedTo = todo.assignedTo || [];

    if (assignedTo.includes(id)) {
      todo.assignedTo = assignedTo.filter((contactId) => contactId !== id);
      updates[`todos/${todoKeysArray[index]}/assignedTo`] = todo.assignedTo;
    }
  });

  if (Object.keys(updates).length > 0) {
    try {
      await patchData('', updates);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Todos:', error);
    }
  }
}


function removeDuplicatesFromGroupedContacts() {
  Object.keys(groupedContacts).forEach(groupKey => {
    groupedContacts[groupKey] = groupedContacts[groupKey].filter((contact, index, self) => {
      const isValid = contact.id !== undefined && contact.id !== null;
      return (
        isValid &&
        index === self.findIndex(c => c.id === contact.id)
      );
    });
  });
}


function updateLocalContactList(id, updatedData) {
  Object.keys(groupedContacts).forEach(groupKey => {
    groupedContacts[groupKey] = groupedContacts[groupKey].filter(contact => contact.id !== id);
  });

  const newInitial = updatedData.initials[0];
  if (!groupedContacts[newInitial]) {
    groupedContacts[newInitial] = [];
  }
  groupedContacts[newInitial].push({
    id,
    ...updatedData,
  });

  removeDuplicatesFromGroupedContacts();
  sortGroupedContacts();
}


async function updateGroupedContacts(existingData, updatedData, id) {
  const oldInitial = existingData.initials[0];
  const newInitial = updatedData.initials[0];

  if (oldInitial !== newInitial) {
    if (groupedContacts[oldInitial]) {
      groupedContacts[oldInitial] = groupedContacts[oldInitial].filter(contact => contact.id !== id);
    }

    if (!groupedContacts[newInitial]) groupedContacts[newInitial] = [];
    groupedContacts[newInitial].push(updatedData);
  } else {
    updateContactInSameGroup(existingData, updatedData, id, oldInitial);
  }

  removeDuplicatesFromGroupedContacts();
}


function updateContactInSameGroup(existingData, updatedData, id, groupInitial) {
  const group = groupedContacts[groupInitial];
  if (group) {
    const contactIndex = group.findIndex(contact => contact.id === id);
    if (contactIndex !== -1) {
      group[contactIndex] = {
        ...group[contactIndex],
        ...updatedData,
      };
    }
  }
}


function finalizeEdit(id, updatedData) {
  updateLocalContactList(id, updatedData);
  updateContactlist();
  closeEditContact();

  document.getElementById('contact-info').innerHTML = '';

  const newInitial = updatedData.initials[0];
  const newGroup = groupedContacts[newInitial];

  if (!newGroup || newGroup.length === 0) {
    return;
  }

  const newIndex = newGroup.findIndex(contact => {
    return contact.id === id;
  });

  if (newIndex === -1) {
    return;
  }

  currentGroupInitial = newInitial;
  currentContactIndex = newIndex;

  getContactInfo(currentGroupInitial, currentContactIndex);
}


function sortGroupedContacts() {
  Object.keys(groupedContacts).forEach(groupKey => {
    groupedContacts[groupKey].sort((a, b) => {
      const nameA = a.user?.name || a.name || '';
      const nameB = b.user?.name || b.name || '';
      return nameA.localeCompare(nameB);
    });
  });
}


function getContactInfo(groupInitial, contactIndex) {
  const group = groupedContacts[groupInitial];
  if (!group || group.length === 0) {
    return;
  }

  const contact = group[contactIndex];
  if (!contact) {
    return;
  }

  const contactColor = contact.color || '#CCCCCC';
  const contactHTML = generateContactHtml(groupInitial, contactIndex, contact, contactColor);
  const contactWrapperHTML = generateContactWrapperHtml(contactHTML);

  renderContactInfo(contactHTML, contactWrapperHTML);
}



//js anpassen, editcontact fehler beim speichern fixen, slideshow
//js funktion update contactInfo erstellen für abschluss bei editcontact?
