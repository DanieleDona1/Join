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
    contactListField: document.getElementById('contact-list-field'),
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
 * Resets the contact form inputs to their default values.
 */
function resetContactForm() {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phonenumber').value = '';
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
    groupedContacts[oldInitial] = groupedContacts[oldInitial].filter((contact) => contact.id !== id);
  }

  if (!groupedContacts[newInitial]) {
    groupedContacts[newInitial] = [];
  }
  groupedContacts[newInitial].push(updatedData);
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
    const contactIndex = group.findIndex((contact) => contact.id === id);
    if (contactIndex !== -1) {
      group[contactIndex] = {
        ...group[contactIndex],
        ...updatedData,
      };
    }
  }
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

  const newIndex = newGroup.findIndex((contact) => contact.id === id);
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
