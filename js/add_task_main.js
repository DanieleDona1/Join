isUserLoggedIn();
let selectedInitials = [];

/**
 * Initializes the "Add Tasks" page by setting up authentication, UI components, and event handlers.
 *
 * @async
 * @returns {Promise<void>} - Resolves when the initialization is complete.
 */
async function onloadAddtasks() {
  await generateHeaderInitials();
  await createContactlistAddTask();
  loadDropDown();
  subtaskKeyDownAddSubtask();
  initTaskButtons();
  setClearButtonHandler();
  initCustomDropdowns();
  initFieldNavigation();
  setupOutsideClickForCustomSelects();
  blockEnterSubmit('form-add-task');
  initializeValidation();
}

/**
 * Splits a full name into first name and last name.
 *
 * @param {string} fullName - The full name to split, with the first name followed by the last name(s).
 * @returns {Object} An object containing `firstName` and `lastName`.
 * @property {string} firstName - The first name extracted from the full name.
 * @property {string} lastName - The last name(s) extracted from the full name.
 */
function splitName(fullName) {
  let p = fullName.split(' ');
  let f = p[0];
  let l = p.slice(1).join(' ');
  return { firstName: f, lastName: l };
}

/**
 * Asynchronously creates a contact list and adds structured tasks for each contact.
 *
 * This function loads contact data from the database, validates the data,
 * and populates the global `contactList` array with structured objects containing
 * contact details such as ID, color, first name, and last name.
 *
 * @async
 * @function createContactlistAddTask
 * @returns {Promise<void>} A promise that resolves once the contact list is created.
 */
async function createContactlistAddTask() {
  try {
    let data = await loadData('contacts');
    if (!isValidData(data)) return; // Daten validieren
    populateContactList(data); // Kontaktliste erstellen
  } catch (error) {
    console.error('Fehler beim Erstellen der Kontaktliste:', error);
  }
}

/**
 * Validates the contact data.
 *
 * This function checks if the provided data is valid (not null, undefined, or empty).
 *
 * @function isValidData
 * @param {Object|null} data - The data to validate, typically loaded from a database.
 * @returns {boolean} Returns `true` if the data is valid, otherwise `false`.
 */
function isValidData(data) {
  if (!data || Object.keys(data).length === 0) {
    console.log('Keine Kontakte vorhanden oder Datenabruf fehlgeschlagen.');
    return false;
  }
  return true;
}

/**
 * Populates the global contact list with structured contact objects.
 *
 * This function iterates over the contact data, splits each contact's full name
 * into first and last name, and appends the structured contact objects to
 * the global `contactList` array.
 *
 * @function populateContactList
 * @param {Object} data - The contact data object, where each key represents a contact ID,
 *                        and the value contains the contact details.
 * @returns {void}
 */
function populateContactList(data) {
  contactList.length = 0; // Liste leeren
  Object.keys(data).forEach((key) => {
    let full = data[key].name;
    let { firstName, lastName } = splitName(full);
    contactList.push({ id: key, color: data[key].color, firstName, lastName });
  });
}

/**
 * Initializes task buttons by adding event listeners and updating their states.
 *
 * @returns {void}
 */
function initTaskButtons() {
  const btns = document.querySelectorAll('.task-button');
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', () => {
      deactivateAllButtons(btns);
      btns[i].classList.add('active');
      updateButtonIcons(btns);
    });
  }
  updateButtonIcons(btns);
}

/**
 * Deactivates all task buttons by removing the 'active' class.
 *
 * @param {NodeList} btns - A list of button elements to deactivate.
 * @returns {void}
 */
function deactivateAllButtons(btns) {
  for (let i = 0; i < btns.length; i++) btns[i].classList.remove('active');
}

/**
 * Updates the icons of the task buttons based on their active state and color.
 *
 * @param {NodeList} btns - A list of button elements to update.
 * @returns {void}
 */
function updateButtonIcons(btns) {
  for (let i = 0; i < btns.length; i++) {
    let b = btns[i],
      c = b.getAttribute('data-color');
    let img = b.querySelector('img');
    let t = b.classList.contains('active') ? 'active' : 'inactive';
    img.src = `../assets/icons/add_tasks/${t}_icon_${c}.svg`;
  }
}

/**
 * Prevents form submission when the Enter key is pressed within the specified form.
 *
 * @param {string} formId - The ID of the form element to monitor for Enter key presses.
 *
 * @example
 * // Prevent form submission on Enter key press for a form with ID "myForm"
 * blockEnterSubmit('myForm');
 */
function blockEnterSubmit(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    });
  }
}
