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
 * Attaches or re-attaches event listeners to the toggle buttons.
 */
function generateEventListenerToggleButtons() {
  const toggleButton = document.getElementById('toggleButtons');
  if (toggleButton) {
    toggleButton.removeEventListener('click', toggleEditDelete);
    toggleButton.addEventListener('click', toggleEditDelete);
  } else {
    // console.warn('toggleButton does not exist.');
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
 * Validates the contact form inputs.
 * @param {string} name - The name to validate.
 * @param {string} email - The email to validate.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} True if the inputs are valid, false otherwise.
 */
function validateForm(name, email, phone) {
  return (
    validateName(name.trim()) &&
    validateEmail(email.trim()) &&
    validatePhone(phone.trim())
  );
}

// Validierungsfunktionen
function validateName(value) {
  const regex = /^[a-zA-Z\s]{2,}$/;
  return regex.test(value);
}

function validateEmail(value) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}

function validatePhone(value) {
  return value.length >= 6;
}




/**
 * Displays a success message after adding a contact.
 */
function showSuccessMessage() {
  document.getElementById('success-message').classList.remove('d-none');
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
 * Removes duplicate contacts from each group in the grouped contacts.
 */
function removeDuplicatesFromGroupedContacts() {
  Object.keys(groupedContacts).forEach((groupKey) => {
    groupedContacts[groupKey] = groupedContacts[groupKey].filter((contact, index, self) => {
      const isValid = contact.id !== undefined && contact.id !== null;
      return isValid && index === self.findIndex((c) => c.id === contact.id);
    });
  });
}

/**
 * Removes a contact from all groups in the grouped contacts.
 * @param {string} id - Unique identifier of the contact to remove.
 */
function removeContactFromGroups(id) {
  const groupKeys = Object.keys(groupedContacts);
  for (let i = 0; i < groupKeys.length; i++) {
    const groupKey = groupKeys[i];
    groupedContacts[groupKey] = groupedContacts[groupKey].filter((contact) => contact.id !== id);
  }
}

/**
 * Cleans and sorts all groups in the grouped contacts.
 */
function cleanAndSortGroupedContacts() {
  removeDuplicatesFromGroupedContacts();
  sortGroupedContacts();
}

/**
 * Cleans up grouped contacts by removing duplicates.
 */
function cleanGroupedContacts() {
  removeDuplicatesFromGroupedContacts();
}

/**
 * Sorts all groups in the grouped contacts by contact names.
 */
function sortGroupedContacts() {
  Object.keys(groupedContacts).forEach((groupKey) => {
    groupedContacts[groupKey].sort((a, b) => {
      const nameA = a.user?.name || a.name || '';
      const nameB = b.user?.name || b.name || '';
      return nameA.localeCompare(nameB);
    });
  });
}

/**
 * Retrieves the color of a contact.
 * @param {Object} contact - The contact object.
 * @returns {string} The color of the contact or a default color.
 */
function getContactColor(contact) {
  return contact.color || '#CCCCCC';
}

/**
 * Removes duplicate contacts from a group based on their IDs.
 * @param {Array<Object>} group - Group of contact objects.
 * @returns {Array<Object>} Filtered group without duplicates.
 */
function removeDuplicates(group) {
  return group.filter((contact, index, self) => index === self.findIndex((c) => c.id === contact.id));
}

/**
 * Clears the contact information displayed in the UI.
 */
function clearContactInfo() {
  document.getElementById('contact-info').innerHTML = '';
}
