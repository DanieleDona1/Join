/**
 * Edits the specified task by updating its data and re-rendering the task board.
 *
 * This function retrieves and saves user changes (priority, assigned person, subtasks),
 * updates the `currentTodos` array, and triggers a re-render of the task board.
 *
 * @param {number} i - The index of the task in the `currentTodos` array.
 */
function editTask(i) {
  if (checkRequiredTitleEditFields()) {
  getUserChangedData(i);
  saveCurrentPriority(i);
  saveCurrentAssignedTo(i);
  saveCurrentSubtask(i);

  todos = JSON.parse(JSON.stringify(currentTodos));
  renderTasks();
  closeDialog();
  }
}

/**
 * Checks if the required "Title Edit" fields are valid.
 * Calls `checkField` to validate a specific field and updates the validity status.
 *
 * @returns {boolean} - Returns `true` if the required fields are valid, otherwise `false`.
 */
function checkRequiredTitleEditFields() {
  let valid = true;
  valid &= checkField('titleEdit', 'titleErrorEdit');
  return valid;
}

/**
 * Updates the todo data for the specified index based on user input and sends the updated data to a remote server.
 *
 * @param {number} i - The index of the todo item in the `currentTodos` array to update.
 */
function getUserChangedData(i) {
  let editTitle = document.getElementById('titleEdit').value;
  let textareaEdit = document.getElementById('textareaEdit').value;
  let dueDate = document.getElementById('dateEdit').value;

  currentTodos[i]['title'] = editTitle;
  currentTodos[i]['description'] = textareaEdit;
  currentTodos[i]['dueDate'] = dueDate;

  editTaskRemote(todoKeysArray[i], { title: currentTodos[i].title, description: currentTodos[i].description, dueDate: currentTodos[i].dueDate });
}

/**
 * Loads the popup for adding a task and the contact list.
 *
 * @async
 * @param {string} category - The task category.
 * @param {string} contentId - The ID of the content area.
 * @returns {Promise<void>} - Resolves when the popup and contact list are loaded.
 */
async function loadPopUpAddTask(category) {
  generatePopUpAddTask(category);
  await createContactlistAddTask();
  loadDropDown();
  subtaskKeyDownAddSubtask();
  setupOutsideClickForCustomSelects();
}

/**
 * Saves the current priority to the specified todo and updates the remote task.
 *
 * @param {number} i - The index of the todo item in the currentTodos array.
 */
function saveCurrentPriority(i) {
  currentTodos[i]['prio'] = activePriority;
  editTaskRemote(todoKeysArray[i], { prio: currentTodos[i]['prio'] });
}

/**
 * Saves the assigned contacts for a specific todo item and sends the updated data to a remote server.
 *
 * @param {number} i - The index of the todo item in the `currentTodos` array to update.
 */
function saveCurrentAssignedTo(i) {
  if (selectedContactsKeys.length > 0) {
    currentTodos[i]['assignedTo'] = selectedContactsKeys;
    editTaskRemote(todoKeysArray[i], { assignedTo: currentTodos[i]['assignedTo'] });
  }
}
