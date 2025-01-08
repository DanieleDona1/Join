
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
  selectedContacts= [];
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
    if (dueDate === 'NaN-NaN-NaN') console.log('Invalid date format');
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
  