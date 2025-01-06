
/**
 * Formats the input date and updates the input value.
 *
 * @param {HTMLInputElement} input - The input element containing the date string to format.
 * @returns {void}
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
    return isNaN(d)
      ? 'NaN-NaN-NaN'
      : `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
          .getDate()
          .toString()
          .padStart(2, '0')}`;
  }

  /**
   * Loads and initializes the dropdown menu and its options.
   *
   * @returns {void}
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

  /**
   * Generates the initials from a contact's first and last name.
   *
   * @param {Object} c - The contact object containing `firstName` and `lastName` properties.
   * @returns {string} The uppercase initials, formed from the first letters of the first and last names.
   */
  function getInitials(c) {
    return c.firstName.charAt(0).toUpperCase() + c.lastName.charAt(0).toUpperCase();
  }

  /**
   * Generates the option template for one contact entry.
   *
   * @param {Object} c - The contact object.
   * @param {string} inits - The initials of the contact.
   * @returns {string} The HTML template.
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
