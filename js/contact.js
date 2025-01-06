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
  content.innerHTML = '<div class="contacts-wrapper">';
  const sortedInitials = Object.keys(groupedContacts).sort();
  for (let i = 0; i < sortedInitials.length; i++) {
    const initial = sortedInitials[i];
    let groupHTML = `<div class="contact-group"><h2>${initial}</h2><div class="contactlist-vector"></div>`;
    const contacts = groupedContacts[initial];
    for (let j = 0; j < contacts.length; j++) {
      groupHTML += generateFullContentHTML(initial, contacts[j], j);
    }
    content.innerHTML += groupHTML + `</div>`;
  }
  content.innerHTML += '</div>';
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

  return getContactHtmlTemplate(groupInitial, contactIndex, contact, contactColor, initials, name, mail, number);
}


function renderContactInfo(contactHTML, contactWrapperHTML) {
  const { popup, contactInfo, contactListField } = getContactInfoElements();
  if (!popup || !contactInfo || !contactListField) {
    console.error('Wichtige DOM-Elemente fehlen!');
    return;
  }
  if (window.innerWidth <= 850) {
    renderForSmallScreens(popup, contactWrapperHTML, contactListField, contactInfo);
  } else {
    renderForLargeScreens(contactInfo, contactHTML, popup, contactListField);
  }
  generateEventListenerToggleButtons();
}


function getContactInfoElements() {
  return {
    popup: document.getElementById('contact-info-window'),
    contactInfo: document.getElementById('contact-info'),
    contactListField: document.getElementById('contact-list-field')
  };
}


function renderForSmallScreens(popup, contactWrapperHTML, contactListField, contactInfo) {
  popup.innerHTML = contactWrapperHTML;
  popup.classList.remove('d-none');
  contactListField.classList.add('d-none');
  contactInfo.innerHTML = '';
  moveButtons();
}


function renderForLargeScreens(contactInfo, contactHTML, popup, contactListField) {
  contactInfo.innerHTML = contactHTML;
  popup.classList.add('d-none');
  contactListField.classList.remove('d-none');
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
  if (!validateForm()) return;
  button.disabled = true;
  const { name, mail, phone } = getContactFormData();
  try {
    await handleAddContact(name, mail, phone);
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Kontakts:', error);
  } finally {
    button.disabled = false;
  }
}


function validateForm() {
  const form = document.querySelector('form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}


function getContactFormData() {
  return {
    name: document.getElementById('name').value,
    mail: document.getElementById('email').value,
    phone: document.getElementById('phonenumber').value,
  };
}


async function handleAddContact(name, mail, phone) {
  await addNewContact(name, mail, phone);
  showSuccessMessage();
  resetContactForm();
  await updateContactlist();
  closeAddContact();
  hideSuccessMessageAfterDelay();
}


function showSuccessMessage() {
  document.getElementById('success-message').classList.remove('d-none');
}


function resetContactForm() {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phonenumber').value = '';
}


function hideSuccessMessageAfterDelay() {
  setTimeout(() => {
    document.getElementById('success-message').classList.add('d-none');
  }, 3000);
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
  const contactInfoWindow = getContactInfoWindow();
  if (!contactInfoWindow) return;

  const movedButtonsContainer = getOrCreateMovedButtonsContainer(contactInfoWindow);
  const editDeleteButtons = getEditDeleteButtons();
  if (!editDeleteButtons) return;

  moveEditDeleteButtons(editDeleteButtons, movedButtonsContainer);
  hideEditDeleteButtons(editDeleteButtons);
}


function getContactInfoWindow() {
  const contactInfoWindow = document.getElementById('contact-info-window');
  if (!contactInfoWindow) {
    console.warn("moveButtons: 'contact-info-window' existiert nicht.");
  }
  return contactInfoWindow;
}


function getOrCreateMovedButtonsContainer(contactInfoWindow) {
  let movedButtonsContainer = document.getElementById('movedButtons');
  if (!movedButtonsContainer) {
    movedButtonsContainer = document.createElement('div');
    movedButtonsContainer.id = 'movedButtons';
    movedButtonsContainer.style.display = 'none';
    contactInfoWindow.appendChild(movedButtonsContainer);
  }
  return movedButtonsContainer;
}


function getEditDeleteButtons() {
  const editDeleteButtons = document.getElementById('editDeleteButtons');
  if (!editDeleteButtons) {
    console.warn("moveButtons: 'editDeleteButtons' existiert nicht.");
  }
  return editDeleteButtons;
}


function moveEditDeleteButtons(editDeleteButtons, movedButtonsContainer) {
  while (editDeleteButtons.firstChild) {
    movedButtonsContainer.appendChild(editDeleteButtons.firstChild);
  }
}


function hideEditDeleteButtons(editDeleteButtons) {
  editDeleteButtons.style.display = 'none';
}


async function deleteContactRemote(id) {
  const updates = getTodoUpdatesForDeletedContact(id);

  if (Object.keys(updates).length > 0) {
    await applyTodoUpdates(updates);
  }
}


function getTodoUpdatesForDeletedContact(id) {
  const updates = {};

  currentTodos.forEach((todo, index) => {
    const updatedAssignedTo = filterAssignedContacts(todo.assignedTo, id);
    if (updatedAssignedTo) {
      updates[`todos/${todoKeysArray[index]}/assignedTo`] = updatedAssignedTo;
    }
  });

  return updates;
}


function filterAssignedContacts(assignedTo, id) {
  if (!assignedTo || !assignedTo.includes(id)) return null;
  return assignedTo.filter((contactId) => contactId !== id);
}


async function applyTodoUpdates(updates) {
  try {
    await patchData('', updates);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Todos:', error);
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
  removeContactFromGroups(id);
  addUpdatedContactToGroup(id, updatedData);
  cleanAndSortGroupedContacts();
}


function removeContactFromGroups(id) {
  const groupKeys = Object.keys(groupedContacts);
  for (let i = 0; i < groupKeys.length; i++) {
    const groupKey = groupKeys[i];
    groupedContacts[groupKey] = groupedContacts[groupKey].filter(contact => contact.id !== id);
  }
}


function addUpdatedContactToGroup(id, updatedData) {
  const newInitial = updatedData.initials[0];
  if (!groupedContacts[newInitial]) {
    groupedContacts[newInitial] = [];
  }
  groupedContacts[newInitial].push({
    id,
    ...updatedData,
  });
}


function cleanAndSortGroupedContacts() {
  removeDuplicatesFromGroupedContacts();
  sortGroupedContacts();
}


async function updateGroupedContacts(existingData, updatedData, id) {
  const oldInitial = existingData.initials[0];
  const newInitial = updatedData.initials[0];

  if (oldInitial !== newInitial) {
    moveContactToNewGroup(oldInitial, newInitial, updatedData, id);
  } else {
    updateContactInSameGroup(existingData, updatedData, id, oldInitial);
  }

  cleanGroupedContacts();
}


function moveContactToNewGroup(oldInitial, newInitial, updatedData, id) {
  if (groupedContacts[oldInitial]) {
    groupedContacts[oldInitial] = groupedContacts[oldInitial].filter(contact => contact.id !== id);
  }

  if (!groupedContacts[newInitial]) {
    groupedContacts[newInitial] = [];
  }
  groupedContacts[newInitial].push(updatedData);
}


function cleanGroupedContacts() {
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
  clearContactInfo();

  const { newInitial, newIndex } = findContactInUpdatedGroup(id, updatedData);
  if (newIndex === -1) return;

  setCurrentContact(newInitial, newIndex);
  getContactInfo(currentGroupInitial, currentContactIndex);
}


function clearContactInfo() {
  document.getElementById('contact-info').innerHTML = '';
}


function findContactInUpdatedGroup(id, updatedData) {
  const newInitial = updatedData.initials[0];
  const newGroup = groupedContacts[newInitial];
  if (!newGroup || newGroup.length === 0) return { newInitial, newIndex: -1 };

  const newIndex = newGroup.findIndex(contact => contact.id === id);
  return { newInitial, newIndex };
}


function setCurrentContact(newInitial, newIndex) {
  currentGroupInitial = newInitial;
  currentContactIndex = newIndex;
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
  const contact = getContactFromGroup(groupInitial, contactIndex);
  if (!contact) return;

  const contactColor = getContactColor(contact);
  const contactHTML = generateContactHtml(groupInitial, contactIndex, contact, contactColor);
  const contactWrapperHTML = generateContactWrapperHtml(contactHTML);

  renderContactInfo(contactHTML, contactWrapperHTML);
}


function getContactFromGroup(groupInitial, contactIndex) {
  const group = groupedContacts[groupInitial];
  if (!group || group.length === 0) return null;

  return group[contactIndex] || null;
}


function getContactColor(contact) {
  return contact.color || '#CCCCCC';
}




//js anpassen, editcontact fehler beim speichern fixen, slideshow
//js funktion update contactInfo erstellen für abschluss bei editcontact?
