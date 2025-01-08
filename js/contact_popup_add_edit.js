/**
 * Closes the contact info window and shows the contact list field.
 */
function closeContactInfoWindow() {
  document.getElementById('contact-list-field').classList.remove('d-none');
  document.getElementById('contact-info-window').classList.add('d-none');
}

/**
 * Opens the add contact popup by modifying the DOM elements.
 */
function openAddContact() {
  document.getElementById('background-pop-up').classList.remove('d-none');
  document.getElementById('pop-up-add-contact').classList.remove('d-none', 'slide-out');
  document.querySelector('body').classList.add('overflow-hidden');
}

/**
 * Closes the add contact popup and resets its state after the animation.
 */
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

/**
 * Opens the edit contact popup and renders the contact information.
 * @param {string} groupedcontact - Group identifier of the contact.
 * @param {number} index - Index of the contact within the group.
 */
function openEditContact(groupedcontact, index) {
  currentGroupInitial = groupedcontact;
  currentContactIndex = index;

  document.getElementById('background-pop-up').classList.remove('d-none');
  document.getElementById('pop-up-edit-contact').classList.remove('d-none', 'slide-out');
  document.querySelector('body').classList.add('overflow-hidden');

  renderEditContact(groupedcontact, index);
}

/**
 * Closes the edit contact popup and resets its state after the animation.
 */
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

/**
 * Adds a new contact and handles the form submission.
 * @async
 * @param {HTMLButtonElement} button - Button element triggering the function.
 */
async function addContact(button) {
  if (!validateForm()) return;
  button.disabled = true;
  const { name, mail, phone } = getContactFormData();
  try {
    await handleAddContact(name, mail, phone);
  } catch (error) {
    console.error('Error adding contact:', error);
  } finally {
    button.disabled = false;
  }
}

/**
 * Handles the addition of a new contact by updating the data and UI.
 * @async
 * @param {string} name - Name of the contact.
 * @param {string} mail - Email of the contact.
 * @param {string} phone - Phone number of the contact.
 */
async function handleAddContact(name, mail, phone) {
  await addNewContact(name, mail, phone);
  showSuccessMessage();
  resetContactForm();
  await updateContactlist();
  closeAddContact();
  hideSuccessMessageAfterDelay();
}

/**
 * Adds a new contact to the data store.
 * @async
 * @param {string} name - Name of the contact.
 * @param {string} mail - Email of the contact.
 * @param {string} number - Phone number of the contact.
 */
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

/**
 * Deletes a contact from the system and updates the UI.
 * @async
 * @param {string} id - Unique identifier of the contact to delete.
 */
async function deleteContact(id) {
  try {
    await deleteData('/contacts/' + id);
    await deleteContactRemote(id);
    await updateContactlist();

    document.getElementById('contact-info').innerHTML = '';
    closeContactInfoWindow();
  } catch (error) {
    console.error('Error deleting contact:', error);
  }
}

/**
 * Edits an existing contact and updates the system and UI.
 * @async
 * @param {string} id - Unique identifier of the contact to edit.
 */
async function editContact(id) {
  const { name, mail, number } = getUpdatedContactData();
  const existingData = await loadData('/contacts/' + id);

  if (!validateInitials(existingData)) return;

  const updatedData = createUpdatedContact(existingData, name, mail, number);
  await updateGroupedContacts(existingData, updatedData, id);
  await putData('/contacts/' + id, updatedData);

  finalizeEdit(id, updatedData);
}

/**
 * Validates the initials of the existing contact data.
 * @param {Object} existingData - Existing contact data object.
 * @returns {boolean} True if the initials are valid, false otherwise.
 */
function validateInitials(existingData) {
  if (!existingData.initials || existingData.initials.length < 1) {
    console.error('Error: Initials of the existing contact are not defined.');
    return false;
  }
  return true;
}

/**
 * Deletes references to a contact in todos remotely.
 * @async
 * @param {string} id - Unique identifier of the contact to delete.
 */
async function deleteContactRemote(id) {
  const updates = getTodoUpdatesForDeletedContact(id);

  if (Object.keys(updates).length > 0) {
    await applyTodoUpdates(updates);
  }
}

/**
 * Adds an updated contact to its corresponding group in the grouped contacts.
 * @param {string} id - Unique identifier of the contact.
 * @param {Object} updatedData - Updated contact data.
 */
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

/**
 * Finalizes the editing of a contact by updating the lists and UI.
 * @param {string} id - Unique identifier of the contact.
 * @param {Object} updatedData - The updated contact data.
 */
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
