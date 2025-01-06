/**
 * HTML content wrapper for the contact section.
 * @type {string}
 */
let contactWrapperHTML = ''; 


/**
 * Current contact information element.
 * @type {HTMLElement | null}
 */
let contactInfo;


/**
 * Initial of the current group.
 * @type {string | null}
 */
let currentGroupInitial;


/**
 * Index of the current contact.
 * @type {number | null}
 */
let currentContactIndex;


/**
 * Initializes the application by loading and rendering contact data.
 * Executes on page load.
 * @async
 */
async function onloadFunc() {
  await createContactlist();
  renderPhoneList();
  await generateHeaderInitials();
  await loadTodosArray();
  currentTodos = JSON.parse(JSON.stringify(todos));
}


/**
 * Renders the phone contact list by sorting and grouping contacts.
 */
function renderPhoneList() {
  const sortedContacts = sortContacts(contactList);
  groupedContacts = groupContactsByInitial(sortedContacts);
  displayGroupedContacts(groupedContacts);
}


/**
 * Creates the contact list by fetching and processing contact data.
 * @async
 */
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


/**
 * Sorts the contact list alphabetically by name.
 * @param {Array<Object>} contacts - List of contact objects.
 * @returns {Array<Object>} Sorted list of contacts.
 */
function sortContacts(contacts) {
  return contacts.sort((a, b) => a.user.name.localeCompare(b.user.name));
}


/**
 * Groups contacts by their initials.
 * @param {Array<Object>} contacts - List of contact objects.
 * @returns {Object} Grouped contacts by initials.
 */
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


/**
 * Generates the HTML for a contact item.
 * @param {string} initial - Initial of the contact group.
 * @param {Object} contact - Contact object.
 * @param {number} index - Index of the contact in the group.
 * @returns {string} HTML content for the contact item.
 */
function generateFullContentHTML(initial, contact, index) {
  const initials = contact?.user?.initials || '??';
  const contactColor = contact?.color || '#CCCCCC';

  return getContactHTMLTemplate(initial, initials, contact, index, contactColor);
}


/**
 * Displays grouped contacts on the UI.
 * @param {Object} groupedContacts - Contacts grouped by initials.
 */
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


/**
 * Generates the HTML for a contact detail view.
 * @param {string} groupInitial - Initial of the contact group.
 * @param {number} contactIndex - Index of the contact in the group.
 * @param {Object} contact - Contact object containing the data.
 * @param {string} contactColor - Background color for the contact initials.
 * @returns {string} HTML string for the contact detail view.
 */
function generateContactHtml(groupInitial, contactIndex, contact, contactColor) {
  const initials = contact.user?.initials || contact.initials;
  const name = contact.user?.name || contact.name;
  const mail = contact.user?.mail || contact.mail;
  const number = contact.user?.number || contact.number;

  if (!initials || !name || !mail || !number) {
    console.error('Error: Missing contact information.', contact);
    return '<div class="error">Contact information missing</div>';
  }

  return getContactHtmlTemplate(groupInitial, contactIndex, contact, contactColor, initials, name, mail, number);
}


/**
 * Renders the contact detail view based on the screen size.
 * @param {string} contactHTML - HTML content for the contact.
 * @param {string} contactWrapperHTML - Wrapper HTML for the contact.
 */
function renderContactInfo(contactHTML, contactWrapperHTML) {
  const { popup, contactInfo, contactListField } = getContactInfoElements();
  if (!popup || !contactInfo || !contactListField) {
    console.error('Error: Essential DOM elements are missing!');
    return;
  }
  if (window.innerWidth <= 850) {
    renderForSmallScreens(popup, contactWrapperHTML, contactListField, contactInfo);
  } else {
    renderForLargeScreens(contactInfo, contactHTML, popup, contactListField);
  }
  generateEventListenerToggleButtons();
}


/**
 * Retrieves essential DOM elements for rendering contact info.
 * @returns {Object} An object containing popup, contactInfo, and contactListField elements.
 */
function getContactInfoElements() {
  return {
    popup: document.getElementById('contact-info-window'),
    contactInfo: document.getElementById('contact-info'),
    contactListField: document.getElementById('contact-list-field')
  };
}


/**
 * Renders the contact detail view for small screens.
 * @param {HTMLElement} popup - Popup element for the contact info.
 * @param {string} contactWrapperHTML - Wrapper HTML for the contact.
 * @param {HTMLElement} contactListField - The contact list field element.
 * @param {HTMLElement} contactInfo - The contact info element.
 */
function renderForSmallScreens(popup, contactWrapperHTML, contactListField, contactInfo) {
  popup.innerHTML = contactWrapperHTML;
  popup.classList.remove('d-none');
  contactListField.classList.add('d-none');
  contactInfo.innerHTML = '';
  moveButtons();
}


/**
 * Renders the contact detail view for large screens.
 * @param {HTMLElement} contactInfo - The contact info element.
 * @param {string} contactHTML - HTML content for the contact.
 * @param {HTMLElement} popup - Popup element for the contact info.
 * @param {HTMLElement} contactListField - The contact list field element.
 */
function renderForLargeScreens(contactInfo, contactHTML, popup, contactListField) {
  contactInfo.innerHTML = contactHTML;
  popup.classList.add('d-none');
  contactListField.classList.remove('d-none');
}


/**
 * Attaches or re-attaches event listeners to the toggle buttons.
 */
function generateEventListenerToggleButtons() {
  const toggleButton = document.getElementById('toggleButtons');
  if (toggleButton) {
    toggleButton.removeEventListener('click', toggleEditDelete);
    toggleButton.addEventListener('click', toggleEditDelete);
  } else {
    console.warn('toggleButton does not exist.');
  }
}


/**
 * Transforms a contact object into a consistent format.
 * @param {Object} contact - Contact object to transform.
 * @returns {Object | null} Transformed contact object or null if invalid.
 */
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


/**
 * Closes the contact info window and shows the contact list field.
 */
function closeContactInfoWindow() {
  document.getElementById('contact-list-field').classList.remove('d-none');
  document.getElementById('contact-info-window').classList.add('d-none');
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
 * Validates the contact form inputs.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateForm() {
  const form = document.querySelector('form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}


/**
 * Retrieves contact data from the form inputs.
 * @returns {Object} Contact data object containing name, mail, and phone.
 */
function getContactFormData() {
  return {
    name: document.getElementById('name').value,
    mail: document.getElementById('email').value,
    phone: document.getElementById('phonenumber').value,
  };
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
 * Displays a success message after adding a contact.
 */
function showSuccessMessage() {
  document.getElementById('success-message').classList.remove('d-none');
}


/**
 * Resets the contact form inputs to their default values.
 */
function resetContactForm() {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phonenumber').value = '';
}


/**
 * Hides the success message after a delay.
 */
function hideSuccessMessageAfterDelay() {
  setTimeout(() => {
    document.getElementById('success-message').classList.add('d-none');
  }, 3000);
}


/**
 * Updates the contact list by reloading and re-rendering it.
 * @async
 */
async function updateContactlist() {
  contactList = []; 
  await createContactlist(); 
  renderPhoneList(); 
}


/**
 * Extracts initials from a full name.
 * @param {string} fullName - Full name of the contact.
 * @returns {string} Initials derived from the full name.
 */
function getInitials(fullName) {
  const nameParts = fullName.split(' '); 
  const firstInitial = nameParts[0]?.charAt(0).toUpperCase(); 
  const lastInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : ''; 
  return `${firstInitial}${lastInitial}`; 
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
 * Generates a random hexadecimal color string.
 * @returns {string} A random hex color code.
 */
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


/**
 * Renders the contact information in the edit popup.
 * @param {string} groupedcontact - Group identifier of the contact.
 * @param {number} index - Index of the contact within the group.
 */
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
 * Retrieves updated contact data from the edit form inputs.
 * @returns {Object} Updated contact data object containing name, mail, and number.
 */
function getUpdatedContactData() {
  return {
    name: document.getElementById('edit-name').value,
    mail: document.getElementById('edit-email').value,
    number: document.getElementById('edit-phonenumber').value,
  };
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
 * Creates an updated contact object by merging existing and new data.
 * @param {Object} existingData - Existing contact data object.
 * @param {string} name - New name of the contact.
 * @param {string} mail - New email of the contact.
 * @param {string} number - New phone number of the contact.
 * @returns {Object} Updated contact object.
 */
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


/**
 * Removes duplicate contacts from a group based on their IDs.
 * @param {Array<Object>} group - Group of contact objects.
 * @returns {Array<Object>} Filtered group without duplicates.
 */
function removeDuplicates(group) {
  return group.filter((contact, index, self) =>
    index === self.findIndex(c => c.id === contact.id)
  );
}


/**
 * Toggles the visibility of the edit/delete buttons in the contact info popup.
 */
function toggleEditDelete() {
  const movedButtonsContainer = document.getElementById('movedButtons');
  if (!movedButtonsContainer) {
    console.warn("toggleEditDelete: 'movedButtons' does not exist.");
    return;
  }

  if (movedButtonsContainer.style.display === 'none' || movedButtonsContainer.style.display === '') {
    movedButtonsContainer.style.display = 'flex'; 
  } else {
    movedButtonsContainer.style.display = 'none'; 
  }
}


/**
 * Moves the edit/delete buttons to a specific container in the popup.
 */
function moveButtons() {
  const contactInfoWindow = getContactInfoWindow();
  if (!contactInfoWindow) return;

  const movedButtonsContainer = getOrCreateMovedButtonsContainer(contactInfoWindow);
  const editDeleteButtons = getEditDeleteButtons();
  if (!editDeleteButtons) return;

  moveEditDeleteButtons(editDeleteButtons, movedButtonsContainer);
  hideEditDeleteButtons(editDeleteButtons);
}


/**
 * Retrieves the contact info window element.
 * @returns {HTMLElement | null} The contact info window element or null if not found.
 */
function getContactInfoWindow() {
  const contactInfoWindow = document.getElementById('contact-info-window');
  if (!contactInfoWindow) {
    console.warn("moveButtons: 'contact-info-window' does not exist.");
  }
  return contactInfoWindow;
}


/**
 * Creates or retrieves the container for moved buttons in the popup.
 * @param {HTMLElement} contactInfoWindow - The contact info window element.
 * @returns {HTMLElement} The container for moved buttons.
 */
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


/**
 * Retrieves the edit/delete buttons element.
 * @returns {HTMLElement | null} The edit/delete buttons element or null if not found.
 */
function getEditDeleteButtons() {
  const editDeleteButtons = document.getElementById('editDeleteButtons');
  if (!editDeleteButtons) {
    console.warn("moveButtons: 'editDeleteButtons' does not exist.");
  }
  return editDeleteButtons;
}


/**
 * Moves all children of the edit/delete buttons element to a new container.
 * @param {HTMLElement} editDeleteButtons - The edit/delete buttons element.
 * @param {HTMLElement} movedButtonsContainer - The container to move the buttons to.
 */
function moveEditDeleteButtons(editDeleteButtons, movedButtonsContainer) {
  while (editDeleteButtons.firstChild) {
    movedButtonsContainer.appendChild(editDeleteButtons.firstChild);
  }
}


/**
 * Hides the edit/delete buttons element.
 * @param {HTMLElement} editDeleteButtons - The edit/delete buttons element.
 */
function hideEditDeleteButtons(editDeleteButtons) {
  editDeleteButtons.style.display = 'none';
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
 * Retrieves the updates required for todos referencing the contact.
 * @param {string} id - Unique identifier of the contact to delete.
 * @returns {Object} An object containing updates for todos.
 */
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


/**
 * Filters out a specific contact ID from a list of assigned contacts.
 * @param {Array<string>} assignedTo - List of assigned contact IDs.
 * @param {string} id - ID to filter out.
 * @returns {Array<string> | null} Filtered list of contact IDs or null if unchanged.
 */
function filterAssignedContacts(assignedTo, id) {
  if (!assignedTo || !assignedTo.includes(id)) return null;
  return assignedTo.filter((contactId) => contactId !== id);
}


/**
 * Applies updates to todos in the system.
 * @async
 * @param {Object} updates - An object containing todo updates.
 */
async function applyTodoUpdates(updates) {
  try {
    await patchData('', updates);
  } catch (error) {
    console.error('Error updating todos:', error);
  }
}


/**
 * Removes duplicate contacts from each group in the grouped contacts.
 */
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


/**
 * Updates the local contact list by adding or removing contacts in their respective groups.
 * @param {string} id - Unique identifier of the contact.
 * @param {Object} updatedData - Updated contact data.
 */
function updateLocalContactList(id, updatedData) {
  removeContactFromGroups(id);
  addUpdatedContactToGroup(id, updatedData);
  cleanAndSortGroupedContacts();
}


/**
 * Removes a contact from all groups in the grouped contacts.
 * @param {string} id - Unique identifier of the contact to remove.
 */
function removeContactFromGroups(id) {
  const groupKeys = Object.keys(groupedContacts);
  for (let i = 0; i < groupKeys.length; i++) {
    const groupKey = groupKeys[i];
    groupedContacts[groupKey] = groupedContacts[groupKey].filter(contact => contact.id !== id);
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
 * Cleans and sorts all groups in the grouped contacts.
 */
function cleanAndSortGroupedContacts() {
  removeDuplicatesFromGroupedContacts();
  sortGroupedContacts();
}


/**
 * Updates the grouped contacts by moving or updating a contact.
 * @async
 * @param {Object} existingData - The existing contact data.
 * @param {Object} updatedData - The updated contact data.
 * @param {string} id - Unique identifier of the contact.
 */
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


/**
 * Moves a contact from one group to another.
 * @param {string} oldInitial - The initial of the old group.
 * @param {string} newInitial - The initial of the new group.
 * @param {Object} updatedData - The updated contact data.
 * @param {string} id - Unique identifier of the contact.
 */
function moveContactToNewGroup(oldInitial, newInitial, updatedData, id) {
  if (groupedContacts[oldInitial]) {
    groupedContacts[oldInitial] = groupedContacts[oldInitial].filter(contact => contact.id !== id);
  }

  if (!groupedContacts[newInitial]) {
    groupedContacts[newInitial] = [];
  }
  groupedContacts[newInitial].push(updatedData);
}


/**
 * Cleans up grouped contacts by removing duplicates.
 */
function cleanGroupedContacts() {
  removeDuplicatesFromGroupedContacts();
}


/**
 * Updates a contact in the same group.
 * @param {Object} existingData - The existing contact data.
 * @param {Object} updatedData - The updated contact data.
 * @param {string} id - Unique identifier of the contact.
 * @param {string} groupInitial - The initial of the group.
 */
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


/**
 * Clears the contact information displayed in the UI.
 */
function clearContactInfo() {
  document.getElementById('contact-info').innerHTML = '';
}


/**
 * Finds a contact in the updated group after editing.
 * @param {string} id - Unique identifier of the contact.
 * @param {Object} updatedData - The updated contact data.
 * @returns {Object} An object containing the new initial and index of the contact.
 */
function findContactInUpdatedGroup(id, updatedData) {
  const newInitial = updatedData.initials[0];
  const newGroup = groupedContacts[newInitial];
  if (!newGroup || newGroup.length === 0) return { newInitial, newIndex: -1 };

  const newIndex = newGroup.findIndex(contact => contact.id === id);
  return { newInitial, newIndex };
}


/**
 * Sets the current contact for viewing or editing.
 * @param {string} newInitial - The new initial of the group.
 * @param {number} newIndex - The index of the contact within the group.
 */
function setCurrentContact(newInitial, newIndex) {
  currentGroupInitial = newInitial;
  currentContactIndex = newIndex;
}


/**
 * Sorts all groups in the grouped contacts by contact names.
 */
function sortGroupedContacts() {
  Object.keys(groupedContacts).forEach(groupKey => {
    groupedContacts[groupKey].sort((a, b) => {
      const nameA = a.user?.name || a.name || '';
      const nameB = b.user?.name || b.name || '';
      return nameA.localeCompare(nameB);
    });
  });
}


/**
 * Retrieves contact information and displays it in the UI.
 * @param {string} groupInitial - The initial of the group.
 * @param {number} contactIndex - The index of the contact within the group.
 */
function getContactInfo(groupInitial, contactIndex) {
  const contact = getContactFromGroup(groupInitial, contactIndex);
  if (!contact) return;

  const contactColor = getContactColor(contact);
  const contactHTML = generateContactHtml(groupInitial, contactIndex, contact, contactColor);
  const contactWrapperHTML = generateContactWrapperHtml(contactHTML);

  renderContactInfo(contactHTML, contactWrapperHTML);
}


/**
 * Retrieves a contact from a specific group.
 * @param {string} groupInitial - The initial of the group.
 * @param {number} contactIndex - The index of the contact within the group.
 * @returns {Object | null} The contact object or null if not found.
 */
function getContactFromGroup(groupInitial, contactIndex) {
  const group = groupedContacts[groupInitial];
  if (!group || group.length === 0) return null;

  return group[contactIndex] || null;
}


/**
 * Retrieves the color of a contact.
 * @param {Object} contact - The contact object.
 * @returns {string} The color of the contact or a default color.
 */
function getContactColor(contact) {
  return contact.color || '#CCCCCC';
}


//js anpassen, editcontact fehler beim speichern fixen, slideshow
//js funktion update contactInfo erstellen für abschluss bei editcontact?
