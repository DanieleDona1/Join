const selectedInitials = [];

/**
 * Initializes the "Add Tasks" page by setting up authentication, UI components, and event handlers.
 *
 * This function performs the following:
 * - Verifies if the user is logged in.
 * - Generates header initials.
 * - Creates the contact list.
 * - Loads dropdown options.
 * - Sets up event handlers for subtasks, task buttons, and clear button.
 * - Configures custom dropdowns and field navigation.
 * - Handles outside clicks for custom selects.
 *
 * @async
 * @returns {Promise<void>} - Resolves when the initialization is complete.
 */
async function onloadAddtasks() {
  await isUserLoggedIn();
  await generateHeaderInitials();
  await createContactlistAddTask();
  loadDropDown();
  subtaskKeyDownAddSubtask();
  initTaskButtons();
  setClearButtonHandler();
  initCustomDropdowns();
  initFieldNavigation();
  setupOutsideClickForCustomSelects();
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
 * Asynchronously creates a contact list and adds tasks for each contact.
 *
 * This function loads contact data, splits each contact's full name into
 * first name and last name, and populates the `contactList` array with
 * structured objects containing contact details.
 *
 * @async
 * @function createContactlistAddTask
 * @returns {Promise<void>} A promise that resolves once the contact list is populated.
 */
async function createContactlistAddTask() {
  let data = await loadData('contacts');  
  contactList.length = 0; 
  
  let keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    let full = data[keys[i]].name;
    let { firstName, lastName } = splitName(full);
    contactList.push({ id: keys[i], color: data[keys[i]].color, firstName, lastName });
  }
}

/**
 * Formats the input date and updates the input value.
 *
 * This function extracts date parts (day, month, year) from the input value,
 * validates the day and month, and then formats the date in a specified output format.
 * The input value is updated with the formatted date.
 *
 * @param {HTMLInputElement} input - The input element containing the date string to format.
 * @returns {void} This function does not return a value but updates the `input` value.
 */
function formatDate(input) {
  let val = cleanInput(input.value);
  let { day, month, year } = extractDateParts(val);
  ({ day, month } = validateDate(day, month));
  input.value = formatOutput(day, month, year);
}

/**
 * Cleans the input by removing non-digit characters.
 *
 * This function takes a string input and removes all characters that are not digits.
 * It uses a regular expression to replace all non-digit characters with an empty string.
 *
 * @param {string} value - The input string to clean.
 * @returns {string} The cleaned input containing only digits.
 */
function cleanInput(value) {
  return value.replace(/\D/g, '');
}

/**
 * Extracts the day, month, and year from a date string (DDMMYYYY).
 *
 * @param {string} value - The date string to extract parts from.
 * @returns {Object} An object containing day, month, and year as strings.
 */
function extractDateParts(value) {
  return {
    day: value.substring(0, 2),
    month: value.substring(2, 4),
    year: value.substring(4, 8),
  };
}

/**
 * Validates and adjusts the day and month values.
 *
 * Ensures the day is not greater than 31 and the month is not greater than 12.
 * If either is invalid, they are set to the maximum valid values (31 for day, 12 for month).
 *
 * @param {string} day - The day to validate.
 * @param {string} month - The month to validate.
 * @returns {Object} An object with the validated `day` and `month`.
 */
function validateDate(day, month) {
  if (day > 31) day = '31';
  if (month > 12) month = '12';
  return { day, month };
}

/**
 * Formats the date output as a string.
 *
 * The function combines the day, month, and year into a string in the format "DD/MM/YYYY".
 * If any of the components are missing, they are omitted from the output.
 *
 * @param {string} d - The day of the date.
 * @param {string} m - The month of the date (optional).
 * @param {string} y - The year of the date (optional).
 * @returns {string} The formatted date string.
 */
function formatOutput(d, m, y) {
  let out = d;
  if (m) out += '/' + m;
  if (y) out += '/' + y;
  return out;
}

/**
 * Loads and initializes the dropdown menu and its options.
 *
 * This function selects the dropdown element, its list of items, and the display area for initials.
 * It then calls functions to create the contact options and handle the dropdown interactions.
 *
 * @returns {void} This function does not return a value, but it modifies the dropdown and display elements.
 */
function loadDropDown() {
  const dd = document.getElementById('drop-down-1');
  const items = dd.querySelector('.select-items');
  const disp = document.getElementById('initials-display');
  createContactOptions(items);
  handleDropdownOptions(disp);
}

/**
 * Creates and adds contact options to the dropdown list.
 *
 * This function iterates through the `contactList`, generates the initials for each contact,
 * and appends the corresponding option template to the dropdown items list.
 *
 * @param {HTMLElement} items - The DOM element representing the list of dropdown options.
 * @returns {void} This function does not return a value but modifies the `items` DOM element.
 */
function createContactOptions(items) {
  items.innerHTML = ''; 
  for (let i = 0; i < contactList.length; i++) {
    let c = contactList[i],
      inits = getInitials(c);
    items.innerHTML += getOptionTemplate(c, inits);
  }
}

function getInitials(c) {
  return c.firstName.charAt(0).toUpperCase() + c.lastName.charAt(0).toUpperCase();
}

/**
 * Generates the initials from a contact's first and last name.
 *
 * This function takes a contact object, extracts the first letter of the first name and
 * last name, and returns them as uppercase initials.
 *
 * @param {Object} c - The contact object containing `firstName` and `lastName` properties.
 * @param {string} c.firstName - The first name of the contact.
 * @param {string} c.lastName - The last name of the contact.
 * @returns {string} The uppercase initials, formed from the first letters of the first and last names.
 */
function getOptionTemplate(c, inits) {
  return `
    <div class="select-option" data-value="${c.firstName} ${c.lastName}" id="option-${c.firstName}-${c.lastName}">
      <div class="contact">
        <div class="initial" style="background-color:${c.color};">${inits}</div>
        <div class="name">${c.firstName} ${c.lastName}</div>
      </div>
      <input type="checkbox"/>
      <div class="custom-checkbox"></div>
    </div>
  `;
}

/**
 * Handles the interaction with dropdown options.
 *
 * This function adds event listeners to all dropdown options. When an option is clicked,
 * it toggles the selection state of that option and updates the display of the selected initials.
 *
 * @param {HTMLElement} disp - The DOM element where the selected initials are displayed.
 * @returns {void} This function does not return a value but modifies the state of the options and the display.
 */
function handleDropdownOptions(disp) {
  const opts = document.querySelectorAll('.select-option');
  for (let i = 0; i < opts.length; i++) {
    opts[i].addEventListener('click', () => {
      toggleOptionSelection(opts[i]);
      updateInitialsDisplay(disp);
    });
  }
}

/**
 * Checks if the given option belongs to the dropdown with ID 'drop-down-2'.
 *
 * This function checks the closest parent element of the option to see if it matches
 * the dropdown with the specified ID ('drop-down-2').
 *
 * @param {HTMLElement} option - The dropdown option element to check.
 * @returns {boolean} `true` if the option belongs to the dropdown with ID 'drop-down-2', otherwise `false`.
 */
function isDropDown2(option) {
  const p = option.closest('.add-task-custom-select');
  return p && p.id === 'drop-down-2';
}

/**
 * Toggles the selection state of a dropdown option.
 *
 * This function checks if the option belongs to 'drop-down-2'. If not, it toggles the checkbox
 * and updates the relevant classes for the option. It then updates the selected initials based
 * on whether the option was checked or unchecked.
 *
 * @param {HTMLElement} option - The dropdown option element to toggle.
 * @returns {void} This function does not return a value but modifies the state of the option and updates the selected initials.
 */
function toggleOptionSelection(option) {
  if (isDropDown2(option)) return;
  const { initials, checked } = toggleCheckboxAndClasses(option);
  updateSelectedInitials(initials, checked);
}

/**
 * Toggles the checkbox state and updates related classes for a dropdown option.
 *
 * This function toggles the checkbox selection state, updates the option's active and checked
 * classes, and returns the initials and checked status of the option.
 *
 * @param {HTMLElement} opt - The dropdown option element containing the checkbox and related elements.
 * @returns {Object} An object containing the initials and the new checked state of the option.
 * @returns {string} return.initials - The initials text content of the option.
 * @returns {boolean} return.checked - The new checked state of the checkbox.
 */
function toggleCheckboxAndClasses(opt) {
  const box = opt.querySelector('input[type="checkbox"]');
  const c = opt.querySelector('.custom-checkbox');
  const inits = opt.querySelector('.initial').textContent;
  box.checked = !box.checked;
  opt.classList.toggle('active');
  c.classList.toggle('checked');
  return { initials: inits, checked: box.checked };
}

/**
 * Updates the list of selected initials based on the checkbox state.
 *
 * This function adds or removes the given initials from the `selectedInitials` array
 * depending on whether the checkbox is checked or unchecked.
 *
 * @param {string} inits - The initials to add or remove from the selected list.
 * @param {boolean} check - The checkbox state (true for checked, false for unchecked).
 * @returns {void} This function does not return a value but modifies the `selectedInitials` array.
 */
function updateSelectedInitials(inits, check) {
  if (check) {
    if (selectedInitials.indexOf(inits) === -1) selectedInitials.push(inits);
  } else {
    let idx = selectedInitials.indexOf(inits);
    if (idx > -1) selectedInitials.splice(idx, 1);
  }
}

/**
 * Updates the display of selected initials.
 *
 * This function clears the current display and then adds elements for each selected initial
 * based on the `selectedInitials` array. It uses the `findContactByInitial` function to get
 * the contact associated with each initial and then creates an element to represent the initial.
 *
 * @param {HTMLElement} disp - The DOM element where the initials should be displayed.
 * @returns {void} This function does not return a value but modifies the `disp` element.
 */
function updateInitialsDisplay(disp) {
  disp.innerHTML = '';
  for (let i = 0; i < selectedInitials.length; i++) {
    let contactForInit = findContactByInitial(selectedInitials[i]);
    if (contactForInit) disp.innerHTML += createInitialElement(contactForInit);
  }
}

/**
 * Finds a contact by its initials.
 *
 * This function searches through the `contactList` to find a contact whose initials match
 * the provided initial string. It returns the contact object if found, or `null` if no match is found.
 *
 * @param {string} initial - The initials to search for.
 * @returns {Object|null} The contact object that matches the initials, or `null` if no match is found.
 */
function findContactByInitial(initial) {
  for (let i = 0; i < contactList.length; i++) {
    if (getInitials(contactList[i]) === initial) return contactList[i];
  }
  return null;
}

/**
 * Creates a DOM element representing the initials of a contact.
 *
 * This function generates a `div` element with the contact's initials, applying a background
 * color based on the contact's color and formatting the initials using the `getInitials` function.
 *
 * @param {Object} c - The contact object containing details such as color and name.
 * @param {string} c.color - The background color to apply to the initials element.
 * @returns {string} The HTML string for the created `div` element with the contact's initials.
 */
function createInitialElement(c) {
  return `<div class="initial" style="background-color:${c.color};margin-right:10px;">${getInitials(c)}</div>`;
}

/**
 * Initializes task buttons by adding event listeners and updating their states.
 *
 * This function selects all task buttons, adds a click event listener to each button,
 * deactivates all buttons when clicked, activates the clicked button, and updates the button icons.
 *
 * @returns {void} This function does not return a value but modifies the state and appearance of the task buttons.
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
 * This function iterates through all provided task buttons and removes the 'active' class
 * from each one to ensure none of the buttons are in an active state.
 *
 * @param {NodeList} btns - A list of button elements to deactivate.
 * @returns {void} This function does not return a value but modifies the state of the buttons.
 */
function deactivateAllButtons(btns) {
  for (let i = 0; i < btns.length; i++) btns[i].classList.remove('active');
}

/**
 * Updates the icons of the task buttons based on their active state and color.
 *
 * This function iterates through all provided task buttons, checks their active state,
 * and updates the source of the icon image accordingly. It selects the appropriate icon
 * based on whether the button is active or inactive and its associated color.
 *
 * @param {NodeList} btns - A list of button elements to update.
 * @returns {void} This function does not return a value but modifies the `src` attribute of the images inside the buttons.
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
 * Updates the `selectedContacts` list based on the checked checkboxes in the dropdown.
 *
 * This function iterates through all checked checkboxes in the `.select-option` elements,
 * retrieves the associated contact name, and adds the corresponding contact ID from `contactList`
 * to the `selectedContacts` array.
 *
 * @returns {void} This function does not return a value but modifies the `selectedContacts` array.
 */
function activeCheckboxesRemote() {
  const checked = document.querySelectorAll(".select-option input[type='checkbox']:checked");
  for (let i = 0; i < checked.length; i++) {
    const p = checked[i].closest('.select-option');
    const n = p.querySelector('.name').textContent;
    for (let j = 0; j < contactList.length; j++) {
      if (`${contactList[j].firstName} ${contactList[j].lastName}` === n) {
        selectedContacts.push(contactList[j].id);
        break;
      }
    }
  }
}

/**
 * Moves the focus to the next input field when the Enter key is pressed.
 *
 * This function listens for the Enter key press event, prevents the default action (e.g., form submission),
 * and moves the focus to the next input field in the sequence. If the Enter key is pressed on the last input field,
 * it will move the focus to a specific field with the ID 'subtaskInput'.
 *
 * @param {KeyboardEvent} e - The keyboard event triggered by pressing a key.
 * @returns {void} This function does not return a value but changes the focus to the next field.
 */
function moveToNextField(e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // Verhindert das Standardverhalten (Formular abschicken)
    const fields = Array.from(document.querySelectorAll('[id^="input-field-"]'));
    const currentIndex = fields.indexOf(e.target); // Aktuelles Feld finden
    const nextField = fields[currentIndex + 1] || document.getElementById('subtaskInput');
    if (nextField) nextField.focus(); // Fokus auf das nächste Feld setzen
  }
}

/**
 * Prevents the default form submission behavior.
 *
 * This function selects the first form element on the page and attaches an event listener
 * to prevent the default submit behavior when the form is submitted (i.e., preventing page reload).
 *
 * @returns {void} This function does not return a value but prevents the form from being submitted.
 */
function preventFormSubmit() {
  const form = document.querySelector('form'); // Selektiere das Formular
  if (form) {
    form.addEventListener('submit', (e) => e.preventDefault()); // Verhindere Formular-Submit
  }
}

/**
 * Initializes keyboard navigation between input fields.
 *
 * This function adds an event listener to each input field with an ID starting with 'input-field-'.
 * When the Enter key is pressed, the focus is moved to the next input field in the sequence using
 * the `moveToNextField` function. It allows seamless navigation between input fields using the keyboard.
 *
 * @returns {void} This function does not return a value but sets up the navigation for the input fields.
 */
function initFieldNavigation() {
  const inputFields = document.querySelectorAll('[id^="input-field-"]');
  for (let i = 0; i < inputFields.length; i++) {
    inputFields[i].addEventListener('keydown', moveToNextField);
  }
  preventFormSubmit();
}

/**
 * Adds a new subtask when the Enter key is pressed in the subtask input field.
 *
 * This function listens for a `keydown` event on the subtask input field (with ID 'subtaskInput').
 * If the Enter key is pressed and the input field is not empty, it calls the `addCurrentSubtask`
 * function to add the subtask. If the input field is empty, it prevents the default action (e.g.,
 * submitting the form or adding an empty subtask).
 *
 * @returns {void} This function does not return a value but adds an event listener to the subtask input field.
 */
function subtaskKeyDownAddSubtask() {
  const inp = document.getElementById('subtaskInput');
  if (inp) {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (e.target.value.trim() === '') {
          e.preventDefault();
        } else {
          addCurrentSubtask();
          e.preventDefault();
        }
      }
    });
  }
}

/**
 * Resets the form with the ID 'form-add-task'.
 *
 * This function selects the form with the specified ID and resets its input fields to their
 * default values, effectively clearing the form and removing any user input.
 *
 * @returns {void} This function does not return a value but resets the form.
 */
function resetForm() {
  const f = document.getElementById('form-add-task');
  if (f) f.reset();
}

/**
 * Resets the state of all priority buttons to their inactive state.
 *
 * This function iterates through all task buttons (with the class 'task-button'), removes the 'active'
 * class, and updates the icon to indicate the inactive state. The icon's `src` attribute is updated
 * based on the button's `data-color` attribute to reflect the inactive state.
 *
 * @returns {void} This function does not return a value but modifies the appearance and state of the buttons.
 */
function resetPriorityButtons() {
  const btns = document.querySelectorAll('.task-button');
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove('active');
    const img = btns[i].querySelector('img');
    const c = btns[i].getAttribute('data-color');
    img.src = `../assets/icons/add_tasks/inactive_icon_${c}.svg`;
  }
}

/**
 * Sets the default priority button to 'medium' when no priority is selected.
 *
 * This function selects the button with `data-color` attribute set to 'medium', sets it as active,
 * and updates the icon to reflect the active state. If the 'medium' button is found, it changes its icon
 * to indicate the active state for the default priority.
 *
 * @returns {void} This function does not return a value but modifies the state of the button.
 */
function setDefaultPriority() {
  const mb = document.querySelector('[data-color="medium"]');
  if (mb) {
    mb.classList.add('active');
    const img = mb.querySelector('img');
    img.src = `../assets/icons/add_tasks/active_icon_medium.svg`;
  }
}

/**
 * Clears all added subtasks by calling the `removeAddedSubtask` function.
 *
 * This function triggers the `removeAddedSubtask` function with the argument `'all'` to remove
 * all subtasks that have been added.
 *
 * @returns {void} This function does not return a value but clears all subtasks.
 */
function clearSubtasks() {
  removeAddedSubtask('all');
}

/**
 * Hides all error messages by adding the 'd-none' class to each error message element.
 *
 * This function selects all elements with the class 'error-msg-addtask' and adds the 'd-none' class
 * to each, effectively hiding the error messages from view.
 *
 * @returns {void} This function does not return a value but hides all error messages.
 */
function hideAllErrorMessages() {
  const errs = document.querySelectorAll('.error-msg-addtask');
  for (let i = 0; i < errs.length; i++) errs[i].classList.add('d-none');
}

/**
 * Resets the task category dropdown to its default state.
 *
 * This function selects the dropdown with the ID 'drop-down-2' and, if found, resets its selected
 * value by setting the text of the `.select-selected` element to 'Select task category'. It also
 * clears the `currentTaskCategory` variable to indicate no category is currently selected.
 *
 * @returns {void} This function does not return a value but resets the dropdown and the task category.
 */
function resetCategoryDropdown() {
  const d2 = document.getElementById('drop-down-2');
  if (!d2) return;
  const s = d2.querySelector('.select-selected');
  if (s) s.textContent = 'Select task category';
  currentTaskCategory = '';
}

/**
 * Resets the state of all category options in the dropdown.
 *
 * This function selects the dropdown with the ID 'drop-down-2' and iterates through all of its
 * options (elements with the class 'select-option'). It removes the 'active' class from each option,
 * effectively resetting the selected state of all options in the dropdown.
 *
 * @returns {void} This function does not return a value but modifies the state of the dropdown options.
 */
function resetCategoryOptions() {
  const d2 = document.getElementById('drop-down-2');
  if (!d2) return;
  const opts = d2.querySelectorAll('.select-option');
  for (let i = 0; i < opts.length; i++) opts[i].classList.remove('active');
}

/**
 * Clears the selected contacts and their initials.
 *
 * This function resets the `selectedInitials` and `selectedContacts` arrays by setting their
 * lengths to 0, effectively clearing any previously selected contacts and their corresponding initials.
 *
 * @returns {void} This function does not return a value but clears the selected contacts and initials.
 */
function clearSelectedContacts() {
  selectedInitials.length = 0;
  selectedContacts.length = 0;
}

/**
 * Clears the initials display by removing all content.
 *
 * This function selects the element with the ID 'initials-display' and clears its inner HTML,
 * effectively removing all displayed initials.
 *
 * @returns {void} This function does not return a value but clears the content of the initials display.
 */
function clearInitialsDisplay() {
  const d = document.getElementById('initials-display');
  if (d) d.innerHTML = '';
}

/**
 * Unchecks all contact options in the given dropdown.
 *
 * This function iterates through all options in the provided dropdown (`dd`), unchecks the checkboxes,
 * and removes the 'active' and 'checked' classes from the options, effectively resetting all contact selections.
 *
 * @param {HTMLElement} dd - The dropdown element containing the contact options.
 * @returns {void} This function does not return a value but modifies the state of the contact options in the dropdown.
 */
function uncheckAllContactOptions(dd) {
  const opts = dd.querySelectorAll('.select-option');
  for (let i = 0; i < opts.length; i++) {
    const box = opts[i].querySelector('input[type="checkbox"]');
    const c = opts[i].querySelector('.custom-checkbox');
    if (box.checked) box.checked = false;
    opts[i].classList.remove('active');
    c.classList.remove('checked');
  }
}

/**
 * Resets the contacts dropdown to its default state.
 *
 * This function resets the dropdown with the ID 'drop-down-1'. It updates the selected text to
 * 'Select contacts to assign', clears the selected contacts and initials, and unchecks all contact options
 * by invoking the corresponding helper functions (`clearSelectedContacts`, `clearInitialsDisplay`,
 * and `uncheckAllContactOptions`).
 *
 * @returns {void} This function does not return a value but modifies the state of the contacts dropdown.
 */
function resetContactsDropdown() {
  const d1 = document.getElementById('drop-down-1');
  if (!d1) return;
  const sel = d1.querySelector('.select-selected');
  if (sel) sel.textContent = 'Select contacts to assign';
  clearSelectedContacts();
  clearInitialsDisplay();
  uncheckAllContactOptions(d1);
}

/**
 * Resets all form fields and UI elements to their default states.
 *
 * This function calls several helper functions to reset the form, priority buttons,
 * subtasks, error messages, category dropdown, and contacts dropdown.
 *
 * @returns {void} This function does not return a value.
 */
function clearAll() {
  resetForm();
  resetPriorityButtons();
  setDefaultPriority();
  clearSubtasks();
  hideAllErrorMessages();
  resetCategoryDropdown();
  resetCategoryOptions();
  resetContactsDropdown();
}

/**
 * Sets up the click event handler for the clear button.
 *
 * This function adds a click event listener to the element with the ID 'clear-button'.
 * When the button is clicked, the `clearAll` function is called to reset the form and UI elements.
 *
 * @returns {void} This function does not return a value but sets up the event listener.
 */
function setClearButtonHandler() {
  const c = document.getElementById('clear-button');
  if (c) c.addEventListener('click', clearAll);
}

/**
 * Creates and adds a new task, then redirects to the board page.
 *
 * This function first checks if all required fields are filled. If valid, it activates remote checkboxes,
 * formats the due date, gathers user data for the task (based on the given category),
 * and calls the `addTask` function to save the task. Afterward, it redirects the user to the board page.
 *
 * @param {string} cat - The category for the new task.
 * @returns {Promise<void>} This function returns a promise that resolves when the task is added and the page is redirected.
 */
async function createAddTask(cat) {
  if (checkRequiredFields()) {
    activeCheckboxesRemote();
    formateDueDate();
    const d = getUserAddTaskData(cat);
    await addTask(d);
    redirectToPage('./board.html');
  }
}

/**
 * Checks if all required fields are filled and valid.
 *
 * This function verifies if the fields for title, due date, and category are correctly filled.
 * It checks the title and due date fields using the `checkField` function and validates the category
 * using the `checkCategory` function. It returns `true` if all required fields are valid, otherwise `false`.
 *
 * @returns {boolean} Returns `true` if all required fields are valid, otherwise `false`.
 */
function checkRequiredFields() {
  let v = true;
  v &= checkField('input-field-title', 'titleError');
  v &= checkField('input-field-date', 'dueDateError');
  v &= checkCategory();
  return v;
}

/**
 * Checks if a field is filled and displays an error message if not.
 *
 * This function checks if the input field with the given ID is filled. If the field is empty,
 * it shows the corresponding error message by removing the 'd-none' class from the error element.
 * If the field is filled, it returns `true`. Otherwise, it returns `false`.
 *
 * @param {string} id - The ID of the input field to be checked.
 * @param {string} errId - The ID of the error message element to be displayed if the field is empty.
 * @returns {boolean} Returns `true` if the field is filled, otherwise `false`.
 */
function checkField(id, errId) {
  const inp = document.getElementById(id);
  const err = document.getElementById(errId);
  if (!inp || inp.value.trim() === '') {
    if (err) err.classList.remove('d-none');
    return false;
  }
  return true;
}

/**
 * Checks if a task category is selected and displays an error message if not.
 *
 * This function checks whether the `currentTaskCategory` is set. If no category is selected (i.e., the category is an empty string),
 * it shows the corresponding error message by removing the 'd-none' class from the error element.
 * If a category is selected, it returns `true`. Otherwise, it returns `false`.
 *
 * @returns {boolean} Returns `true` if a task category is selected, otherwise `false`.
 */

function checkCategory() {
  const catErr = document.getElementById('categoryError');
  if (currentTaskCategory === '') {
    if (catErr) catErr.classList.remove('d-none');
    return false;
  }
  return true;
}

/**
 * Sets the priority for the task based on the active button selection.
 *
 * This function waits for 10 milliseconds before checking the active priority button.
 * It then sets the `activePriority` variable to the `data-color` attribute of the active button,
 * which represents the task's priority. If no button is active, it sets `activePriority` to an empty string.
 *
 * @returns {void} This function does not return a value but updates the `activePriority` variable.
 */
function setPriority() {
  setTimeout(() => {
    const b = document.querySelector('.task-button.active');
    activePriority = b ? b.getAttribute('data-color') : '';
  }, 10);
}

/**
 * Sets the category for the task.
 *
 * This function assigns the provided category value to the `currentTaskCategory` variable,
 * which represents the selected task category.
 *
 * @param {string} c - The category to be set for the task.
 * @returns {void} This function does not return a value but updates the `currentTaskCategory` variable.
 */
function setCategory(c) {
  currentTaskCategory = c;
}

/**
 * Formats the due date from the input field and assigns it to the `dueDate` variable.
 *
 * This function retrieves the value from the due date input field, formats it to the `YYYY-MM-DD` format using the `formatDateToYMD` function,
 * and assigns the result to the `dueDate` variable. If the formatted date is invalid (i.e., 'NaN-NaN-NaN'), it logs a message to the console.
 *
 * @returns {void} This function does not return a value but updates the `dueDate` variable.
 */
function formateDueDate() {
  const val = document.getElementById('input-field-date')?.value;
  dueDate = formatDateToYMD(val);
  if (dueDate === 'NaN-NaN-NaN') console.log('lol');
}

/**
 * Converts a date string in the format 'DD/MM/YYYY' to 'YYYY-MM-DD'.
 *
 * This function takes a date string (`ds`) in the format 'DD/MM/YYYY', splits it into day, month, and year components,
 * and then constructs a new date in the 'YYYY-MM-DD' format. If any of the components are missing or the date is invalid,
 * it returns 'NaN-NaN-NaN'.
 *
 * @param {string} ds - The date string in 'DD/MM/YYYY' format.
 * @returns {string} Returns the date in 'YYYY-MM-DD' format, or 'NaN-NaN-NaN' if the date is invalid.
 */
function formatDateToYMD(ds) {
  const [day, month, year] = ds.split('/');
  if (!year || !month || !day) return 'NaN-NaN-NaN';
  const d = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  return isNaN(d) ? 'NaN-NaN-NaN' : `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}

/**
 * Initializes all custom dropdowns on the page.
 *
 * This function selects all elements with the class `add-task-custom-select` and applies the `setupCustomSelect` function to each of them.
 * It is used to initialize custom-styled dropdowns with the desired behavior and functionality.
 *
 * @returns {void} This function does not return a value but initializes custom dropdown elements on the page.
 */
function initCustomDropdowns() {
  const cS = document.querySelectorAll('.add-task-custom-select');
  for (let i = 0; i < cS.length; i++) setupCustomSelect(cS[i]);
}

/**
 * Sets up the behavior for a custom select dropdown.
 *
 * This function initializes the interaction for a custom dropdown element. It adds an event listener to the selected option
 * (`.select-selected`) to toggle the visibility of the dropdown options (`.select-items`). It also sets up listeners for individual
 * options in the dropdown. The custom select is identified by the provided element `c` and its `id`.
 *
 * @param {HTMLElement} c - The custom select element to be initialized.
 * @returns {void} This function does not return a value but sets up event listeners for the dropdown functionality.
 */
function setupCustomSelect(c) {
  const s = c.querySelector('.select-selected');
  const oC = c.querySelector('.select-items');
  const sId = c.getAttribute('id');
  s.addEventListener('click', () => {
    oC.classList.toggle('select-hide');
    c.classList.toggle('open');
  });
  addOptionListeners(oC, sId, s, c);
}

/**
 * Adds click listeners to dropdown options to update the selected text.
 *
 * Updates the selected option text when an option is clicked and hides the dropdown if the ID is 'drop-down-2'.
 *
 * @param {HTMLElement} oC - The options container (`.select-items`).
 * @param {string} sId - The ID of the custom select.
 * @param {HTMLElement} s - The selected option display (`.select-selected`).
 * @param {HTMLElement} c - The custom select element.
 * @returns {void}
 */
function addOptionListeners(oC, sId, s, c) {
  const o = oC.querySelectorAll('.select-option');
  for (let i = 0; i < o.length; i++) {
    o[i].addEventListener('click', () => {
      if (sId === 'drop-down-2') {
        s.textContent = o[i].textContent;
        oC.classList.add('select-hide');
        c.classList.remove('open');
      }
    });
  }
}

/**
 * Sets up a listener to close custom selects when clicking outside of them.
 *
 * This function adds an event listener to the document to detect clicks outside any open custom select dropdowns. If a click occurs
 * outside the dropdown, it hides the dropdown and closes it by removing the 'open' class.
 *
 * @returns {void}
 */
function setupOutsideClickForCustomSelects() {
  document.addEventListener('click', (e) => {
    // Bei jedem Klick die aktuellen Dropdowns neu abfragen
    const allDropdowns = document.querySelectorAll('.add-task-custom-select');
    for (let i = 0; i < allDropdowns.length; i++) {
      const s = allDropdowns[i].querySelector('.select-selected');
      const oC = allDropdowns[i].querySelector('.select-items');
      if (!s.contains(e.target) && !oC.contains(e.target)) {
        oC.classList.add('select-hide');
        allDropdowns[i].classList.remove('open');
      }
    }
  });
}
