let selectedInitials = [];

/**
 * Initializes the "Add Tasks" page by setting up authentication, UI components, and event handlers.
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
  blockEnterSubmit('form-add-task');
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

function blockEnterSubmit(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Verhindert das Abschicken des Formulars
      }
    });
  }
}
