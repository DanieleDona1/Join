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
 * Populates a dropdown menu with contact items and sets up selection handling.
 *
 * This function takes a dropdown ID, clears its current contents, and populates it with contact items
 * created using the `createContactItemTemplate` function. After the dropdown is populated, it sets up
 * event listeners to handle selection changes and verifies the checkbox status of the contacts.
 *
 * @param {string} dropdownId - The ID of the dropdown element to populate with contact items.
 * @returns {void} This function does not return any value.
 */
function populateDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = '';
  contactList.forEach((contact) => {
    const contactItemHTML = createContactItemTemplate(contact);
    dropdown.innerHTML += contactItemHTML;
  });
  toggleSelectionOnChange(dropdownId);
  checkUserCheckbox('dropdown');
}

/**
 * Checks and clicks the checkboxes in the specified container based on the selected contact keys.
 *
 * This function checks all checkboxes within the specified container and simulates a click event on
 * each checkbox whose associated contact ID is included in the selected contact keys for the current task.
 *
 * @param {string} containerId - The ID of the container element that holds the checkboxes.
 * @returns {void} This function does not return any value.
 */
function checkUserCheckbox(containerId) {
  let contactAllSelectedKeys = getSelectedContactsKey(currentTaskId);
  let container = document.getElementById(containerId);
  let checkboxes = container.querySelectorAll('.contact-checkbox');

  checkboxes.forEach((input) => {
    let contactId = input.id;
    if (contactAllSelectedKeys.includes(contactId)) {
      input.click();
    }
  });
}

/**
 * Updates the background image of the checkbox's associated image element based on its checked state.
 *
 * This function checks if the provided element is a checkbox with the class `.contact-checkbox`.
 * If it is, it updates the `backgroundImage` of the next sibling element (typically an image) to reflect
 * whether the checkbox is checked or unchecked.
 *
 * @param {HTMLElement} inputCheckboxId - The checkbox element whose checked state determines the background image.
 * @returns {void} This function does not return any value.
 */
function urlLoadSubtaskImg(inputCheckboxId) {
  if (inputCheckboxId.matches('.contact-checkbox')) {
    const checkboxImage = inputCheckboxId.nextElementSibling;

    if (inputCheckboxId.checked) {
      checkboxImage.style.backgroundImage = "url('../assets/icons/board/checkbox_checked.svg')";
    } else {
      checkboxImage.style.backgroundImage = "url('../assets/icons/board/checkbox_unchecked.svg')";
    }
  }
}

/**
 * Toggles the background image of the checkbox's sibling element based on its checked state.
 *
 * @param {Event} event - The event triggered by the checkbox click.
 * @returns {void}
 */
function urlToggleSubtaskImg(event) {
  if (event.target && event.target.matches('.contact-checkbox')) {
    const checkbox = event.target;
    const checkboxImage = checkbox.nextElementSibling;

    if (checkbox.checked) {
      checkboxImage.style.backgroundImage = "url('../assets/icons/board/checkbox_checked.svg')";
    } else {
      checkboxImage.style.backgroundImage = "url('../assets/icons/board/checkbox_unchecked.svg')";
    }
  }
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
