/**
 * Creates and adds a new task, then redirects to the board page.
 *
 * This function first checks if all required fields are filled. If valid, it activates remote checkboxes,
 * formats the due date, gathers user data for the task (based on the given category),
 * and calls the `addTask` function to save the task. Afterward, it redirects the user to the board page.
 *
 * @param {string} taskCategory - The category for the new task.
 * @returns {Promise<void>} This function returns a promise that resolves when the task is added and the page is redirected.
 */
async function createAddTask(taskCategory) {
  selectedContacts = [];
  if (checkRequiredFields()) {
    activeCheckboxesRemote();
    formateDueDate();
    const taskData = getUserAddTaskData(taskCategory);
    console.log('userInputData', taskData);

    await addTask(taskData);
    showAddTaskMessage();
    redirectToPage("./board.html");
  }
}


/**
 * Validates the required fields for a form.
 * This function checks if the title, due date, and category fields are correctly filled out.
 * It returns a boolean indicating whether all required fields are valid.
 *
 * @function checkRequiredFields
 * @returns {boolean} - Returns true if all required fields are valid, otherwise false.
 */
function checkRequiredFields() {
  let allFieldsAreValid = true;

  allFieldsAreValid &= checkField("input-field-title", "titleError");
  allFieldsAreValid &= checkField("input-field-date", "dueDateError");
  allFieldsAreValid &= checkCategory();

  return allFieldsAreValid;
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
  if (!inp || inp.value.trim() === "") {
    if (err) err.classList.remove("d-none");
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
  const catErr = document.getElementById("categoryError");
  if (currentTaskCategory === "") {
    if (catErr) catErr.classList.remove("d-none");
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
    const activeButton = document.querySelector(".task-button.active");
    activePriority = activeButton ? activeButton.getAttribute("data-color") : "";
  }, 10);
}

/**
 * Sets the category for the task.
 *
 * This function assigns the provided category value to the `currentTaskCategory` variable,
 * which represents the selected task category.
 *
 * @param {string} setCategory - The category to be set for the task.
 * @returns {void} This function does not return a value but updates the `currentTaskCategory` variable.
 */
function setCategory(setCategory) {
  currentTaskCategory = setCategory;
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
  const val = document.getElementById("input-field-date")?.value;
  dueDate = formatDateToYMD(val);
  if (dueDate === "NaN-NaN-NaN") console.log("Invalid date format");
}

/**
 * Converts a date string in the format 'DD/MM/YYYY' to 'YYYY-MM-DD'.
 *
 * This function takes a date string (`ds`) in the format 'DD/MM/YYYY', splits it into day, month, and year components,
 * and then constructs a new date in the 'YYYY-MM-DD' format. If any of the components are missing or the date is invalid,
 * it returns 'NaN-NaN-NaN'.
 *
 * @param {string} dateString - The date string in 'DD/MM/YYYY' format.
 * @returns {string} Returns the date in 'YYYY-MM-DD' format, or 'NaN-NaN-NaN' if the date is invalid.
 */
function formatDateToYMD(dateString) {
  const [day, month, year] = dateString.split("/");
  if (!year || !month || !day) return "NaN-NaN-NaN";
  const formattedDate = new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  );
  return isNaN(formattedDate)
    ? "NaN-NaN-NaN"
    : `${formattedDate.getFullYear()}-${(formattedDate.getMonth() + 1).toString().padStart(2, "0")}-${formattedDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;
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
  const checked = document.querySelectorAll(
    ".select-option input[type='checkbox']:checked"
  );
  for (let i = 0; i < checked.length; i++) {
    const p = checked[i].closest(".select-option");
    const n = p.querySelector(".name").textContent;
    for (let j = 0; j < contactList.length; j++) {
      if (`${contactList[j].firstName} ${contactList[j].lastName}` === n) {
        selectedContacts.push(contactList[j].id);
        break;
      }
    }
  }
}

/**
 * Gets today's date in YYYY-MM-DD format.
 * @returns {string} The current date in YYYY-MM-DD format.
 */
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

let titleFieldTouched = false;

/**
 * Validates the title input field.
 * @param {HTMLInputElement} titleInput The title input element.
 * @returns {boolean} True if the title is valid, otherwise false.
 */
function validateTitle(titleInput) {
  const titleError = document.getElementById("titleError");
  const titleValue = titleInput.value.trim();

  // --- 1) Hat der Titel >= 3 Zeichen? ---
  const isTitleLongEnough = titleValue.length >= 3;

  // --- 2) Fehlermeldung nur anzeigen, wenn Feld schon berührt ---
  if (titleFieldTouched && !isTitleLongEnough) {
    titleError.textContent = "Title must be at least 3 characters long.";
    titleError.classList.remove("d-none");
  } else {
    titleError.classList.add("d-none");
  }

  // --- 3) Für die Formular-Gültigkeit: Feld ist nur valid, wenn >= 3 Zeichen ---
  return isTitleLongEnough;
}

/**
 * Handles the blur event for the title input and validates it.
 * @param {HTMLInputElement} titleInput The title input element.
 * @returns {boolean} The validation result.
 */
function validateTitleOnBlur(titleInput) {
  titleFieldTouched = true;
  return validateTitle(titleInput);
}

let dateFieldTouched = false;

/**
 * Checks if the due date input is filled.
 * @param {string} dateValue The value of the due date input.
 * @returns {boolean} True if the input is filled, otherwise false.
 */
function isDueDateFilled(dateValue) {
  return dateValue.length === 10;
}

/**
 * Checks if the due date is a valid future date.
 * @param {string} dateValue The value of the due date input.
 * @returns {boolean} True if the date is in the future, otherwise false.
 */
function isDueDateFuture(dateValue) {
  const errorMessage = isValidDateFormat(dateValue);
  return errorMessage === null;
}

/**
 * Displays the error message for the due date field.
 * @param {string} message The error message to display.
 */
function showDueDateError(message) {
  const dueDateError = document.getElementById("dueDateError");
  dueDateError.textContent = message;
  dueDateError.classList.remove("d-none");
}

/**
 * Hides the error message for the due date field.
 */
function hideDueDateError() {
  const dueDateError = document.getElementById("dueDateError");
  dueDateError.classList.add("d-none");
}

/**
 * Validates the due date input field.
 * @param {HTMLInputElement} dueDateInput The due date input element.
 * @returns {boolean} True if the due date is valid, otherwise false.
 */
function validateDueDate(dueDateInput) {
  const dateValue = dueDateInput.value.trim();
  const isFilled = isDueDateFilled(dateValue);
  const isFutureDate = isDueDateFuture(dateValue);

  handleDueDateError(isFilled, isFutureDate, dateValue);

  return isFilled && isFutureDate;
}

/**
 * Handles the error display for the due date field.
 * @param {boolean} isFilled Whether the input is filled.
 * @param {boolean} isFutureDate Whether the date is in the future.
 * @param {string} dateValue The value of the due date input.
 */
function handleDueDateError(isFilled, isFutureDate, dateValue) {
  if (dateFieldTouched) {
    if (!isFilled) {
      showDueDateError("Due Date is required.");
    } else if (!isFutureDate) {
      showDueDateError(isValidDateFormat(dateValue));
    } else {
      hideDueDateError();
    }
  } else {
    hideDueDateError();
  }
}

/**
 * Handles the blur event for the due date input and validates it.
 * @param {HTMLInputElement} dueDateInput The due date input element.
 * @returns {boolean} The validation result.
 */
function validateDueDateOnBlur(dueDateInput) {
  dateFieldTouched = true;
  return validateDueDate(dueDateInput);
}

/**
 * Validates the category selection.
 * @param {HTMLElement} categorySelect The category select element.
 * @returns {boolean} True if the category is valid, otherwise false.
 */
function validateCategory(categorySelect) {
  const selectedCategory =
    categorySelect.querySelector(".select-selected").innerText;
  return (
    selectedCategory === "Technical Task" || selectedCategory === "User Story"
  );
}

/**
 * Gets the selected category from the category select element.
 * @param {HTMLElement} categorySelect The category select element.
 * @returns {string} The selected category text.
 */
function getSelectedCategory(categorySelect) {
  return categorySelect.querySelector(".select-selected").innerText;
}

/**
 * Displays an error message if the category is invalid.
 * @param {string} message The error message to display.
 */
function showCategoryError(message) {
  const categoryError = document.getElementById("categoryError");
  categoryError.textContent = message;
  categoryError.classList.remove("d-none");
}

/**
 * Hides the error message for the category.
 */
function hideCategoryError() {
  const categoryError = document.getElementById("categoryError");
  categoryError.classList.add("d-none");
  categoryError.textContent = "";
}

/**
 * Handles the blur event for the category selection and validates it.
 * @param {HTMLElement} categorySelect The category select element.
 * @returns {boolean} The validation result.
 */
function validateCategoryOnBlur(categorySelect) {
  const selectedCategory = getSelectedCategory(categorySelect);

  if (isValidCategory(selectedCategory)) {
    hideCategoryError();
    return true;
  }

  showCategoryError("A category is required. Please select one.");
  return false;
}

/**
 * Checks if the selected category is valid.
 * @param {string} selectedCategory The selected category.
 * @returns {boolean} True if the category is valid, otherwise false.
 */
function isValidCategory(selectedCategory) {
  return selectedCategory === "Technical Task" || selectedCategory === "User Story";
}


/**
 * Validates the entire form and updates the button state accordingly.
 */
function validateForm() {
  const titleInput = document.getElementById("input-field-title");
  const dueDateInput = document.getElementById("input-field-date");
  const categorySelect = document.getElementById("drop-down-2");
  const createTaskButton = document.getElementById("create-task-button");

  const isTitleValid = validateTitle(titleInput);
  const isDueDateValid = validateDueDate(dueDateInput);
  const isCategoryValid = validateCategory(categorySelect);

  createTaskButton.disabled = !(isTitleValid && isDueDateValid && isCategoryValid);
}

/**
 * Adds input event listeners for the title input field.
 * @param {HTMLInputElement} titleInput The title input element.
 */
function addTitleInputListeners(titleInput) {
  titleInput.addEventListener("input", () => {
    validateTitle(titleInput);
    validateForm();
  });
  titleInput.addEventListener("blur", () => {
    validateTitleOnBlur(titleInput);
    validateForm();
  });
}

/**
 * Adds input event listeners for the due date input field.
 * @param {HTMLInputElement} dueDateInput The due date input element.
 */
function addDueDateInputListeners(dueDateInput) {
  dueDateInput.addEventListener("input", validateForm);
  dueDateInput.addEventListener("blur", () => {
    validateDueDateOnBlur(dueDateInput);
    validateForm();
  });
}

/**
 * Adds event listeners for the category select element.
 * @param {HTMLElement} categorySelect The category select element.
 */
function addCategoryInputListeners(categorySelect) {
  categorySelect.addEventListener("click", () => {
    validateCategoryOnBlur(categorySelect);
    validateForm();
  });
  categorySelect.addEventListener("change", () => {
    validateCategoryOnBlur(categorySelect);
    validateForm();
  });
  categorySelect.addEventListener("focusout", () => {
    validateCategoryOnBlur(categorySelect);
    validateForm();
  });
}

/**
 * Initializes form validation by adding event listeners.
 */
function initializeValidation() {
  const titleInput = document.getElementById("input-field-title");
  const dueDateInput = document.getElementById("input-field-date");
  const categorySelect = document.getElementById("drop-down-2");

  addTitleInputListeners(titleInput);
  addDueDateInputListeners(dueDateInput);
  addCategoryInputListeners(categorySelect);

  validateForm(); // Initialer Button-Status
}


/**
 * Validates the date format (dd/mm/yyyy) and checks if it's in the future.
 * @param {string} dateValue The date value to validate.
 * @returns {string|null} An error message if the date is invalid, or null if it's valid.
 */
function isValidDateFormat(dateValue) {
  const [day, month, year] = dateValue.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return "Date must be today or in the future.";
  }

  return null;
}

/**
 * Displays a message indicating that a task has been added.
 */
function showAddTaskMessage() {
  const overlay = document.getElementById('add-task-message');
  overlay.style.display = 'flex'; // Div anzeigen

  setTimeout(() => {
    overlay.style.display = 'none'; // Div ausblenden
  }, 2000); // Nach 2 Sekunden
}
