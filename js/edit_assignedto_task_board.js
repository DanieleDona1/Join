/**
 * Toggles the visibility of a dropdown menu and updates related UI elements.
 *
 * This function checks whether the dropdown is open or closed, and either shows or hides it.
 * It also updates the appearance of the associated container and populates the dropdown with options if opened.
 *
 * @param {string} dropdownId - The ID of the dropdown element to toggle.
 * @param {string} openContactsId - The ID of the element that controls the dropdown's open/close state.
 */
function toggleDropdown(dropdownId, openContactsId) {
  const dropdown = document.getElementById(dropdownId);
  const selectDiv = document.getElementById(openContactsId);
  const isOpen = dropdown.style.display === 'block';

  if (isOpen) {
    dropdown.style.display = 'none';
    selectDiv.classList.remove('open');
    document.getElementById('memberEditInitialsContainer').classList.remove('mg-b-200');
  } else {
    dropdown.style.display = 'block';
    selectDiv.classList.add('open');
    document.getElementById('memberEditInitialsContainer').classList.add('mg-b-200');
    populateDropdown(dropdownId);
  }
}

/**
 * Populates the dropdown with contact list items.
 *
 * This function clears the existing content of the dropdown and adds new contact items
 * from the `contactList`. It also attaches a selection change handler to the dropdown.
 *
 * @param {string} dropdownId - The ID of the dropdown element to populate.
 */
function populateDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = '';
  contactList.forEach((contact) => {
    const contactItemHTML = createContactItemTemplate(contact);
    dropdown.innerHTML += contactItemHTML;
  });
  toggleSelectionOnChange(dropdownId);
}

/**
 * Toggles selection of a contact when a checkbox is changed in a dropdown.
 * @param {string} dropdownId - The ID of the dropdown element containing checkboxes.
 */
function toggleSelectionOnChange(dropdownId) {
  const dropdownContent = document.getElementById(dropdownId);
  dropdownContent.addEventListener('change', function (event) {
    if (event.target && event.target.classList.contains('contact-checkbox')) {
      const checkbox = event.target;
      const contactId = checkbox.id;

      toggleContactSelection(checkbox, contactId);
    }
  });
}

/**
 * Toggles the selection state of a contact when a checkbox is checked or unchecked.
 * Updates the contact's visual state and manages the list of selected contacts.
 * @param {HTMLInputElement} checkbox - The checkbox element that was toggled.
 * @param {string} contactKey - The unique key or ID associated with the contact.
 */
function toggleContactSelection(checkbox, contactKey) {
  const contactDiv = document.querySelector(`[for="${contactKey}"]`);
  contactDiv.classList.toggle('selected-contact', checkbox.checked);
  const index = selectedContactsKeys.indexOf(contactKey);

  if (checkbox.checked) {
    if (index === -1) {
      selectedContactsKeys.push(contactKey);
    }
  } else {
    if (index !== -1) {
      selectedContactsKeys.splice(index, 1);
    }
  }
  loadEditMembersInitials();
}

/**
 * Loads and displays the initials of the selected contacts in the member edit container.
 * Clears the container and populates it with the initials of the currently selected contacts.
 */
function loadEditMembersInitials() {
  const membersContainer = document.getElementById('memberEditInitialsContainer');
  membersContainer.innerHTML = '';
  for (let j = 0; j < selectedContactsKeys.length; j++) {
    selectedContacts = contactList.filter((f) => f.id === selectedContactsKeys[j]);

    const name = getName(selectedContacts[0]);
    const initialsName = generateInitials(name);

    membersContainer.innerHTML += memberEditHtmlTemplate(initialsName);
  }
}
