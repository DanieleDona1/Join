
/**
 * Moves the focus to the next input field when the Enter key is pressed.
 *
 * @param {KeyboardEvent} e - The keyboard event triggered by pressing a key.
 * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
   */
  function subtaskKeyDownAddSubtask() {
    const inp = document.getElementById('subtaskInput') || document.getElementById('subtaskInputBoardAddTask');
    if (inp) {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (e.target.value.trim() === '') {
            e.preventDefault();
          } else {
            addCurrentSubtask(inp.id);
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
   * @returns {void}
   */
  function clearAll() {
    resetForm();
    resetPriorityButtons();
    setDefaultPriority();
    hideAllErrorMessages();
    resetCategoryDropdown();
    resetCategoryOptions();
    resetContactsDropdown();
    disableAddTaskButton();
    clearSubtasks();
    titleFieldTouched = false;
    dateFieldTouched = false;
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

  
  function disableAddTaskButton() {
    const addTaskButton = document.getElementById("create-task-button");
    if (addTaskButton) {
      addTaskButton.disabled = true; // Deaktiviert den Button
    }
  }
  