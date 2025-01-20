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

/**
 * Validates if the name contains at least two words (e.g., first and last name)
 * and each word is at least two characters long.
 * @param {string} value - The input name to validate.
 * @returns {boolean} True if the name is valid, false otherwise.
 */
function validateName(value) {
  const regex = /^[a-zA-Z\s.-]{2,}$/;
  if (!regex.test(value)) return false;

  const words = value.trim().split(/\s+/);
  return words.length >= 2 && words.every(word => word.length >= 2);
}
/**
 * Validates an email address format.
 * Ensures the email contains an '@' symbol, a domain name, and a top-level domain.
 * 
 * @param {string} value - The email address to validate.
 * @returns {boolean} True if the email format is valid, false otherwise.
 */
function validateEmail(value) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}

/**
 * Validates a phone number.
 * Ensures the phone number length is between 6 and 15 characters.
 * 
 * @param {string} value - The phone number to validate.
 * @returns {boolean} True if the phone number length is valid, false otherwise.
 */
function validatePhone(value) {
  return value.length >= 6 && value.length <= 15;
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
 * Attaches or re-attaches event listeners to the toggle buttons.
 */
function generateEventListenerToggleButtons() {
  const toggleButton = document.getElementById("toggleButtons");
  if (toggleButton) {
    toggleButton.removeEventListener("click", toggleEditDelete);
    toggleButton.addEventListener("click", toggleEditDelete);
  } else {
    console.warn("toggleButton does not exist.");
  }
}

/**
 * Toggles the visibility of the EditDelete container.
 */
function toggleEditDelete() {
  const editDeleteContainer = document.getElementById('movedButtons');
  const toggleButton = document.getElementById('toggleButtons');

  if (!editDeleteContainer) {
    console.warn("toggleEditDelete: 'movedButtons' does not exist.");
    return;
  }

  if (!editDeleteContainer.classList.contains('show')) {
    activateEditDeleteContainer(editDeleteContainer, toggleButton);
  } else {
    deactivateEditDeleteContainer(editDeleteContainer);
  }
}

/**
 * Activates (shows) the EditDelete container and sets up the event listener for outside clicks.
 * @param {HTMLElement} container - The EditDelete container to be activated.
 * @param {HTMLElement} toggleButton - The toggle button associated with the container.
 */
function activateEditDeleteContainer(container, toggleButton) {
  showEditDeleteContainer(container);
  addOutsideClickListener(container, toggleButton);
}

/**
 * Deactivates (hides) the EditDelete container and removes the event listener for outside clicks.
 * @param {HTMLElement} container - The EditDelete container to be deactivated.
 */
function deactivateEditDeleteContainer(container) {
  hideEditDeleteContainer(container);
  removeOutsideClickListener();
}

/**
 * Shows the EditDelete container by adding the 'show' class.
 * @param {HTMLElement} container - The EditDelete container to be shown.
 */
function showEditDeleteContainer(container) {
  container.classList.add('show');
}

/**
 * Hides the EditDelete container by removing the 'show' class.
 * @param {HTMLElement} container - The EditDelete container to be hidden.
 */
function hideEditDeleteContainer(container) {
  container.classList.remove('show');
}

/**
 * Adds a click event listener to handle clicks outside the EditDelete container.
 * @param {HTMLElement} container - The EditDelete container to check for outside clicks.
 * @param {HTMLElement} toggleButton - The toggle button associated with the container.
 */
function addOutsideClickListener(container, toggleButton) {
  document.addEventListener('click', (event) =>
    handleOutsideClick(event, container, toggleButton)
  );
}

/**
 * Removes the click event listener for outside clicks on the EditDelete container.
 */
function removeOutsideClickListener() {
  document.removeEventListener('click', handleOutsideClick);
}

/**
 * Handles clicks outside the EditDelete container and closes it if necessary.
 * @param {Event} event - The click event.
 * @param {HTMLElement} container - The EditDelete container to be closed if clicked outside.
 * @param {HTMLElement} toggleButton - The toggle button associated with the container.
 */
function handleOutsideClick(event, container, toggleButton) {
  if (!container.contains(event.target) && !toggleButton.contains(event.target)) {
    deactivateEditDeleteContainer(container);
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

/**
 * Toggles the visibility of the contact information element by temporarily adding
 * and removing a CSS class to trigger reflow and CSS animations.
 */
function toggleContactInfo() {
  const container = document.getElementById('contact-info');
  if (!container) {
    console.error('Element mit der ID "contact-info" wurde nicht gefunden!');
    return;
  }

  container.classList.add('info-hide');
  void container.offsetWidth;
  
  setTimeout(() => {
    container.classList.remove('info-hide');
  }, 10);
}


