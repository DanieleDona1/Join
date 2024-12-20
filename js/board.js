let currentDraggedElement;

/**
 * Loads all tasks from Firebase and renders them.
 *
 * @async
 * @function onload
 * @returns {Promise<void>}
 */
async function onload() {
  await isUserLoggedIn();
  await loadTodosArray();
  currentTodos = JSON.parse(JSON.stringify(todos));
  await createContactlistAddTask();
  renderTasks();
  await generateHeaderInitials();
  setupOutsideClickForCustomSelects();
}

/**
 * Renders tasks in their respective columns.
 *
 * @function renderTasks
 * @returns {void}
 */
function renderTasks() {
  updateColumn('toDo', 'toDoContent');
  updateColumn('inProgress', 'inProgressContent');
  updateColumn('awaitFeedback', 'awaitFeedbackContent');
  updateColumn('done', 'doneContent');
  currentTodos = JSON.parse(JSON.stringify(todos));
}

/**
 * Updates a specific column with tasks based on category.
 *
 * @function updateColumn
 * @param {string} category - The task category.
 * @param {string} contentId - The HTML element ID to update.
 * @returns {void}
 */
function updateColumn(category, contentId) {
  let currentTodosCategory = currentTodos.filter((t) => t['category'] === category);
  let content = document.getElementById(contentId);
  content.innerHTML = '';

  for (let i = 0; i < currentTodosCategory.length; i++) {
    const task = currentTodosCategory[i];
    content.innerHTML += generateHtmlTemplate(task);
    const { progressText, progressBar } = initializeProgressElements(task['id']);
    loadProgressText(task, progressText, progressBar);
    loadMembersInitials(task['id'], 'membersContainer');
  }
}

/**
 * Initializes progress elements for a task.
 *
 * @function initializeProgressElements
 * @param {number} taskId - The ID of the task.
 * @returns {{ progressText: HTMLElement, progressBar: HTMLElement }}
 */
function initializeProgressElements(taskId) {
  let progressText = document.getElementById('progressText' + taskId);
  let progressBar = document.getElementById('progressBar' + taskId);

  return { progressText, progressBar };
}

/**
 * Loads and displays progress text and bar for a task.
 *
 * @function loadProgressText
 * @param {Object} task - The task object.
 * @param {HTMLElement} progressText - The progress text element.
 * @param {HTMLElement} progressBar - The progress bar element.
 * @returns {void}
 */
function loadProgressText(task, progressText, progressBar) {
  const subtasks = task.subtask || [];
  const completedTasks = subtasks.filter((sub) => sub.checked).length;
  const totalSubtasks = subtasks.length;

  progressText.innerHTML = `${completedTasks} / ${totalSubtasks} Subtasks`;

  let progressValue;
  if (totalSubtasks > 0) {
    progressValue = (completedTasks / totalSubtasks) * 100;
  } else {
    progressValue = 0;
  }
  progressBar.style.width = progressValue + '%';
}

/**
 * Loads the assigned members for a task and displays their initials in the respective container.
 * Array are used contactList - createContactlistAddTask() and keys-currentTodos[i].assignedTo and selectedContacts.
 */
function loadMembersInitials(i, initialsContainerId) {
  if (currentTodos[i].assignedTo) {
    selectedContactsKeys = getSelectedContactsKey(i);
    const membersContainer = document.getElementById(initialsContainerId + i);
    membersContainer.innerHTML = '';
    for (let j = 0; j < selectedContactsKeys.length; j++) {
      selectedContacts = contactList.filter((f) => f.id === selectedContactsKeys[j]);

      const name = getName(selectedContacts[0]);
      const initialsName = generateInitials(name);

      if (initialsName) {
        membersContainer.innerHTML += memberHtmlTemplate(initialsName);
      }
    }
  }
}

/**
 * Combines first and last name from an object into a full name.
 *
 * @param {Object} arr - The object containing `firstName` and `lastName` properties.
 * @param {string} arr.firstName - The first name.
 * @param {string} arr.lastName - The last name.
 * @returns {string} The full name, combining first and last name.
 */
function getName(arr) {
  return arr.firstName + ' ' + arr.lastName;
}

/**
 * Retrieves the list of contacts assigned to a specific todo item.
 *
 * @param {number} i - The index of the todo item in the `currentTodos` array.
 * @returns {Array} An array of contacts assigned to the todo item at index `i`.
 */
function getSelectedContactsKey(i) {
  return currentTodos[i].assignedTo.map((t) => t);
}

/**
 * Edits a task's properties and sends the update to the API.
 *
 * @function editTaskRemote
 * @param {string} key - The task key.
 * @param {Object} taskData - The updated task data.
 * @returns {void}
 */
function editTaskRemote(key, { title, description, category, dueDate, assignedTo, subtask, prio }) {
  patchData(`/todos/${key}`, { title, description, category, dueDate, assignedTo, subtask, prio });
}

/**
 * Adds a new task to Firebase.
 *
 * @async
 * @function addTask
 * @param {Object} taskData - The new task data.
 * @returns {Promise<void>}
 */
async function addTask({ title, description, dueDate, category, task_category, assignedTo, subtask, prio }) {
  await postData('/todos', {
    title,
    description,
    dueDate,
    category,
    task_category,
    assignedTo,
    subtask,
    prio,
  });
}

/**
 * Creates a new task and updates the respective column.
 *
 * @async
 * @function createTask
 * @param {string} category - The task category.
 * @param {string} contentId - The content ID to update.
 * @returns {Promise<void>}
 */
async function createTask(category, contentId) {
  const userInputData = getUserAddTaskData(category);
  await addTask(userInputData);
  await loadTodosArray();
  currentTodos = JSON.parse(JSON.stringify(todos));
  updateColumn(category, contentId);
}

/**
 * Retrieves user input for adding a task.
 *
 * @function getUserAddTaskData
 * @param {string} swimlane - The category of the task.
 * @returns {Object} - The user input data for the task.
 */
function getUserAddTaskData(swimlane) {
  return {
    title: document.getElementById('input-field-title')?.value || 'No title',
    dueDate: dueDate, //yy-mm-dd Format
    title: document.getElementById('input-field-title')?.value || 'No title',
    dueDate: dueDate, //yy-mm-dd Format
    category: swimlane,
    description: document.getElementById('input-field-description')?.value || 'No description provided.',
    task_category: currentTaskCategory, // User-Story Technical-Task wichtig großgeschrieben User-Story
    assignedTo: selectedContacts,
    subtask: currentSubtasks,
    prio: activePriority,
  };
}

/**
 * Converts an array to an object with indexed keys.
 *
 * @function convertArraytoObject
 * @param {Array} arr - The array to convert.
 * @returns {Object} - The converted object.
 */
function convertArraytoObject(arr) {
  if (Array.isArray(arr)) {
    let myObject = {};
    arr.forEach((member, index) => {
      myObject[`member${index}`] = member;
    });
    return myObject;
  }
}

/**
 * Converts an object to an array of values.
 *
 * @function convertObjectToArray
 * @param {Object} obj - The object to convert.
 * @returns {Array} - The converted array.
 */
function convertObjectToArray(obj) {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.values(obj);
  }
}

/**
 * Starts dragging an element by ID.
 *
 * @function startDragging
 * @param {string} id - The ID of the element being dragged.
 * @returns {void}
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Allows dropping of elements in a drop zone.
 *
 * @function allowDrop
 * @param {Event} event - The drop event.
 * @returns {void}
 */
function allowDrop(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Moves a task to a new category and updates the display.
 *
 * @function moveTo
 * @param {string} newCategory - The new category for the task.
 * @returns {void}
 */
function moveTo(newCategory) {
  todos[currentDraggedElement]['category'] = newCategory;
  editTaskRemote(todoKeysArray[currentDraggedElement], { category: todos[currentDraggedElement].category });
  currentTodos = JSON.parse(JSON.stringify(todos));
  renderTasks();
  removeHighlightAfterDrop();
}

/**
 * Highlights a drop area for drag-and-drop.
 *
 * @function highlight
 * @param {string} id - The ID of the element to highlight.
 * @returns {void}
 */
function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Removes highlight from a drop area.
 *
 * @function removeHighlight
 * @param {string} id - The ID of the element to unhighlight.
 * @returns {void}
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * Removes highlight from all drop areas after a drop action.
 *
 * @function removeHighlightAfterDrop
 * @returns {void}
 */
function removeHighlightAfterDrop() {
  let contentElements = document.getElementsByClassName('content');
  for (let i = 0; i < contentElements.length; i++) {
    contentElements[i].classList.remove('drag-area-highlight');
  }
  document.getElementById('doneContent').classList.remove('drag-area-highlight');
}

/**
 * Initializes content sections and sets up a mutation observer.
 *
 * @function init
 * @returns {void}
 */
function init() {
  const contentElements = getContentElements();
  checkAndInsertText(contentElements);
  const config = { childList: true };
  const observer = createMutationObserver(mutationCallback);
  observeContentElements(observer, contentElements, config);
}

/**
 * Gets all content elements for task display.
 *
 * @function getContentElements
 * @returns {NodeList} - The content elements.
 */
function getContentElements() {
  return document.querySelectorAll('.content');
}

/**
 * Checks each content element and inserts a placeholder if it's empty.
 * @param {HTMLElement[]} contentElements - The list of content elements to check.
 */
function checkAndInsertText(contentElements) {
  contentElements.forEach((element) => {
    if (element.innerHTML.trim() === '') {
      element.innerHTML = `<div class="no-task">No task to do</div>`;

      if (element.id === 'doneContent') {
        changeTextContentDone();
      }
    }
  });
}

/**
 * Creates a new MutationObserver instance with the provided callback.
 * @param {Function} callback - The function to call when mutations are observed.
 * @returns {MutationObserver} - The created MutationObserver instance.
 */
function createMutationObserver(callback) {
  return new MutationObserver(callback);
}

/**
 * Observes the specified content elements for changes using the provided observer.
 * @param {MutationObserver} observer - The observer to use for monitoring changes.
 * @param {HTMLElement[]} contentElements - The elements to observe.
 * @param {Object} config - The configuration options for the observer.
 */
function observeContentElements(observer, contentElements, config) {
  contentElements.forEach((element) => {
    observer.observe(element, config);
  });
}

/**
 * Callback function for handling observed mutations.
 * @param {MutationRecord[]} mutationsList - List of mutations that occurred.
 * @param {MutationObserver} observer - The observer that detected the mutations.
 */
function mutationCallback(mutationsList, observer) {
  mutationsList.forEach(() => {
    checkAndInsertText(getContentElements());
  });
}

/**
 * Changes the text content of the "done" section when there are no completed tasks.
 */
function changeTextContentDone() {
  let parentElement = document.getElementById('doneContent');
  let firstChild = parentElement.children[0];
  firstChild.textContent = 'No task done';
}

/**
 * Initializes the application after the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', init);

/**
 * Opens a dialog to display task details.
 * @param {number} id - The ID of the task to display.
 */
function openTaskDetails(id) {
  loadCurrentPriority(id);
  document.getElementById('dialog').innerHTML = generateDetailTaskTemplate(id);
  loadSubtaskList(id);
  loadAssignedToList(id);
  openDialog();
}

/**
 * Opens the edit dialog for a specific task.
 *
 * @param {number} id - The ID of the task to be edited.
 */
function openEditTask(id) {
  const dueDate = todos[id].dueDate;
  document.getElementById('dialog').innerHTML = generateEditTemplate(id, dueDate);
  setFocusBasedOnPriority();
}

/**
 * Displays the dialog for task details.
 */
function openDialog() {
  const dialog = document.getElementById('dialog');
  const content = dialog.querySelector('.dialog-content');

  content.classList.remove('slide-out');
  dialog.style.display = 'flex';
}

/**
 * Closes the task details dialog and resets the search field if necessary.
 */
function closeDialog(e) {
  const popup = document.querySelector('.pop-up-add-Task');
  if (popup && e && popup.contains(e.target)) return;
  animationSlideOut();
  let filled = document.getElementById('search');
  if (filled && filled.value != '') {
    filled.value = '';
    currentTodos = JSON.parse(JSON.stringify(todos));
    renderTasks();
  }
  currentTodos = JSON.parse(JSON.stringify(todos));
  clearAllArrays();
}

/**
 * Clears all arrays used to store current subtasks, selected contact keys, and other related data.
 */
function clearAllArrays() {
  currentSubtasks = [];
  selectedContactsKeys = [];
  activePriority = 'medium';
}

/**
 * Deletes a task by its ID and updates the current task list.
 * @param {number} id - The ID of the task to delete.
 */
function deleteTask(id) {
  todos = todos.filter((t) => t.id !== id);
  todos.forEach((element, i) => {
    element.id = i;
  });
  currentTodos = JSON.parse(JSON.stringify(todos));

  closeDialog();
  renderTasks();

  deleteData(`/todos/${todoKeysArray[id]}`);
  let newTodoKeysArray = todoKeysArray.filter((t) => t !== todoKeysArray[id]);
  todoKeysArray = newTodoKeysArray;
}

/**
 * Searches tasks by title or description based on user input.
 * @param {string} inputId - The ID of the input field containing the search term.
 */
function searchTitleOrDescription(inputId) {
  document.getElementById('searchResultMsg').style.opacity = '0';
  document.getElementById('searchResultMsgMobile').style.opacity = '0';
  document.getElementById('searchResultMsg').style.opacity = '0';
  document.getElementById('searchResultMsgMobile').style.opacity = '0';
  let filterWord = document.getElementById(inputId).value.trim().toLowerCase();

  currentTodos = todos.filter((t) => (t.title && t.title.toLowerCase().includes(filterWord)) || (t.description && t.description.toLowerCase().includes(filterWord)));
  if (currentTodos.length === 0) {
    document.getElementById('searchResultMsg').style.opacity = '1';
    document.getElementById('searchResultMsgMobile').style.opacity = '1';
  }
  if (currentTodos.length === 0) {
    document.getElementById('searchResultMsg').style.opacity = '1';
    document.getElementById('searchResultMsgMobile').style.opacity = '1';
  }
  renderTasks();
}

/**
 * Creates the "Add Task" button board by generating the contact list and opening the task creation popup.
 *
 * @param {string} category - The category for the task being added.
 * @param {string} contentId - The ID of the content area where the task is being added.
 */
function createAddTaskBtnBoard(category, contentId) {
  createContactlistAddTask();
  generatePopUpAddTask(category, contentId);
}

/**
 * Handles the animation for sliding out the dialog.
 */
function animationSlideOut() {
  const dialog = document.getElementById('dialog');
  const content = dialog.querySelector('.dialog-content');

  content.classList.add('slide-out');
  content.addEventListener(
    'animationend',
    function () {
      dialog.style.display = 'none';
      dialog.classList.add('d-none');
    },
    { once: true }
  );
}

/**
 * Loads and displays the list of members assigned to a specific task.
 *
 * @param {number} i - The index of the task in the `currentTodos` array.
 * Updates the `membersDetailTask` container with member initials and names for each contact in the `assignedTo` list.
 */
function loadAssignedToList(i) {
  if (currentTodos[i].assignedTo) {
    const selectedContactsKeys = currentTodos[i].assignedTo.map((t) => t);
    let membersContainer = document.getElementById('membersDetailTask');
    membersContainer.innerHTML = '';

    for (let j = 0; j < selectedContactsKeys.length; j++) {
      selectedContacts = contactList.filter((f) => f.id === selectedContactsKeys[j]);
      const name = selectedContacts[0].firstName + ' ' + selectedContacts[0].lastName;
      const initialsName = generateInitials(name);

      if (initialsName) {
        membersContainer.innerHTML += memberDetailTaskTemplate(initialsName, name);
      }
    }
  }
}

/**
 * Loads the subtasks for a given task and updates the display.
 * @param {number} i - The index of the task in the currentTodos array.
 */
function loadSubtaskList(i) {
  if (currentTodos[i].subtask) {
    let subtasksList = document.getElementById('subtasksList');
    let checkboxImgUrl;
    let subtaskStatus = currentTodos[i].subtask.map((sub) => sub.checked);
    let subtaskTexts = currentTodos[i].subtask.map((sub) => sub.text);

    for (let j = 0; j < subtaskTexts.length; j++) {
      if (subtaskStatus[j]) {
        checkboxImgUrl = '../assets/icons/board/checkbox-checked.svg';
      } else {
        checkboxImgUrl = '../assets/icons/board/checkbox-unchecked.svg';
      }
      subtasksList.innerHTML += generateSubtaskList(i, j, checkboxImgUrl, subtaskTexts);
    }
  }
}

/**
 * Toggles the checkbox image, updates the subtask status, and refreshes progress.
 * @param {number} i - Index of the main task in the todos array.
 * @param {number} j - Index of the subtask within the main task.
 */
function toggleCheckbox(i, j) {
  toggleCheckboxImage(j);
  updateSubtaskStatus(i, j);
  updateProgress(i);
}

/**
 * Toggles the checkbox image between checked and unchecked.
 * @param {number} j - Index of the subtask checkbox.
 */
function toggleCheckboxImage(j) {
  let checkboxImg = document.getElementById('checkboxImg' + j);
  const isUnchecked = checkboxImg.style.backgroundImage.includes('checkbox-unchecked.svg');

  if (isUnchecked) {
    checkboxImg.style.backgroundImage = "url('../assets/icons/board/checkbox-checked.svg')";
  } else {
    checkboxImg.style.backgroundImage = "url('../assets/icons/board/checkbox-unchecked.svg')";
  }
}

/**
 * Updates the checked status of the specified subtask and saves it.
 * @param {number} i - Index of the main task in the todos array.
 * @param {number} j - Index of the subtask to update.
 */
function updateSubtaskStatus(i, j) {
  todos[i].subtask[j].checked = !todos[i].subtask[j].checked;
  currentTodos = JSON.parse(JSON.stringify(todos)); // State aktualisieren
  editTaskRemote(todoKeysArray[i], { subtask: todos[i].subtask }); // Lokale Speicherung
}

/**
 * Refreshes the progress bar and progress text display for the task.
 * @param {number} i - Index of the main task in the todos array.
 */
function updateProgress(i) {
  const { progressText, progressBar } = initializeProgressElements(i);
  loadProgressText(currentTodos[i], progressText, progressBar);
}

/**
 * Sets focus on the input element with the ID 'subtaskInput'.
 * Checks if the element exists before applying focus.
 */
function focusInput() {
  let subtaskInput = document.getElementById('subtaskInput');
  if (subtaskInput) {
    subtaskInput.focus();
  }
}

/**
 * Handles input events on the 'subtaskInput' field. Updates the subtask icons based on input content.
 * If the input field has content, displays icons for adding or clearing the subtask.
 * If the input field is empty, resets the field.
 *
 * @param {number} id - The unique identifier for the subtask being added or cleared.
 */
function onInputSubtask(inputId) {
  let subtaskInput = document.getElementById(inputId);
  if (subtaskInput.value !== '') {
    document.getElementById('subtaskIcons').innerHTML = /*html*/ `
    <div class="d-flex-c-c">
      <img onclick="focusInput(); resetInputField('${inputId}');" class="add-subtask" src="../assets/icons/board/property-close.svg" alt="close">
      <img class="mg-left" onclick="addCurrentSubtask('${inputId}');" class="add-subtask" src="../assets/icons/board/property-check.svg" alt="check">
    </div>
  `;
  } else {
    resetInputField(inputId);
  }
}

/**
 * Clears the 'subtaskInput' field and resets the 'subtaskIcons' area to show the default add icon.
 * Removes any additional icons previously added to 'subtaskIcons' when input is non-empty.
 */
function resetInputField(inputId) {
  document.getElementById(inputId).value = '';
  document.getElementById('subtaskIcons').innerHTML = /*html*/ `
    <img onclick="focusInput()" class="add-subtask" src="../assets/icons/board/property-add.svg" alt="add">`;
}

/**
 * Adds the current subtask input value to the `currentSubtasks` array with a bullet point.
 * Sets the subtask as unchecked by default, then renders the updated subtask list and resets the input field.
 */
function addCurrentSubtask(inputId) {
  let subtaskInput = document.getElementById(inputId);
  currentSubtasks.push({ checked: false, text: subtaskInput.value });

  renderSubtaskAddedList();
  resetInputField(inputId);
}

/**
 * Retrieves the current value of the 'subtaskInput' field and prepends a bullet point.
 *
 * @returns {string} - The input value prefixed with a bullet point.
 */
function getSubtaskWithBullet(subtaskInput) {
  let bulletPoint = '• ';
  if (subtaskInput.startsWith(bulletPoint)) {
    return subtaskInput;
  }
  if (subtaskInput.startsWith(bulletPoint)) {
    return subtaskInput;
  }
  return bulletPoint + subtaskInput;
}

/**
 * Renders the list of added subtasks by updating the 'subtaskAddedList' element.
 * Clears any existing content and populates it with the current subtasks from `currentSubtasks`.
 */
function renderSubtaskAddedList() {
  let subtaskAddedList = document.getElementById('subtaskAddedList');
  subtaskAddedList.innerHTML = '';

  for (let i = 0; i < currentSubtasks.length; i++) {
    subtaskAddedList.innerHTML += generateSubtaskAddedListTemplate(i);
  }
}

/**
 * Toggles the readonly state of a specified subtask input field, and updates its focus and icons based on the new state.
 * When the field is editable, it focuses the input, updates the icons, prevents accidental icon focus,
 * and adds an event listener to handle focus-out actions.
 *
 * @param {number} index - The index of the subtask, used to identify the correct input field and associated elements.
 */
function readonlyToggle(index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  const subtaskItem = document.getElementById(`subtask-item${index}`);

  toggleReadOnly(inputField);

  if (!inputField.readOnly) {
    focusInputField(inputField);
    updateIconsOnFocus(index);
    preventRemoveIconFocus(index);
    addFocusOutListener(inputField, subtaskItem, index);
  }
}

/**
 * Toggles the readonly property of the specified input field.
 * Sets the input field to readonly if it is currently editable, and vice versa.
 *
 * @param {HTMLInputElement} inputField - The input field element to toggle.
 */
function toggleReadOnly(inputField) {
  inputField.readOnly = !inputField.readOnly;
}

/**
 * Sets focus on the specified input field and moves the cursor to the end of the text.
 *
 * @param {HTMLInputElement} inputField - The input field element to focus and adjust the cursor position.
 */
function focusInputField(inputField) {
  inputField.focus();
  inputField.setSelectionRange(inputField.value.length, inputField.value.length);
}

/**
 * Updates the icons for a specific subtask to show delete and confirm icons when the subtask is focused.
 *
 * @param {number} index - The index of the subtask, used to locate and update the relevant icon container.
 */
function updateIconsOnFocus(index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  subtaskAddedListIcons.innerHTML = /*html*/ `
      <img id="removeIconOnFocus${index}" onclick="removeAddedSubtask(${index});" class="add-subtask" src="../assets/icons/board/property-delete.svg" alt="delete">
      <img class="mg-left" onclick="currentEditSubtask(${index})" class="add-subtask" src="../assets/icons/board/property-check.svg" alt="check">
    `;
}

/**
 * Prevents the focus on the remove icon when it is clicked, allowing for smoother interaction.
 *
 * @param {number} index - The index of the subtask, used to identify the specific remove icon element.
 */
function preventRemoveIconFocus(index) {
  const removeIconOnFocus = document.getElementById(`removeIconOnFocus${index}`);
  if (removeIconOnFocus) {
    removeIconOnFocus.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
  }
}

/**
 * Adds a focusout event listener to the specified input field that handles the logic for
 * editing the subtask when the input field loses focus.
 *
 * @param {HTMLInputElement} inputField - The input field element to which the focusout listener is added.
 * @param {HTMLElement} subtaskItem - The subtask item element associated with the input field, used for validation.
 * @param {number} index - The index of the subtask, used to identify which subtask is being edited.
 */
function addFocusOutListener(inputField, subtaskItem, index) {
  const handleFocusOut = (event) => {
    if (shouldHandleFocusOut(event, subtaskItem)) {
      handleSubtaskEdit(index);
      updateIconsOffFocus(index);
      inputField.readOnly = true;
      document.removeEventListener('focusout', handleFocusOut);
    }
  };
  inputField.addEventListener('focusout', handleFocusOut);
}

/**
 * Determines whether the focusout event should be handled based on the related target
 * and the specific subtask item.
 *
 * @param {FocusEvent} event - The focusout event to evaluate.
 * @param {HTMLElement} subtaskItem - The subtask item element that is being checked against.
 * @returns {boolean} - Returns true if the focusout should be handled; otherwise, false.
 */
function shouldHandleFocusOut(event, subtaskItem) {
  return !subtaskItem.contains(event.relatedTarget) && event.relatedTarget?.id !== 'removeIconOnFocus';
}

/**
 * Handles the editing of a subtask at the specified index.
 * If a subtask exists at the given index in the currentSubtasks array,
 * it invokes the currentEditSubtask function for that subtask.
 *
 * @param {number} index - The index of the subtask to be edited.
 */
function handleSubtaskEdit(index) {
  if (currentSubtasks[index]) {
    currentEditSubtask(index);
  }
}

/**
 * Updates the icons displayed for a specific subtask when it loses focus.
 * Replaces the current icons with edit and delete icons, allowing further actions on the subtask.
 *
 * @param {number} index - The index of the subtask for which the icons are being updated.
 */
function updateIconsOffFocus(index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  if (subtaskAddedListIcons) {
    subtaskAddedListIcons.innerHTML = /*html*/ `
      <img onclick="readonlyToggle(${index});" class="add-subtask" src="../assets/icons/board/edit.svg" alt="edit">
      <img class="mg-left" onclick="removeAddedSubtask(${index})" class="add-subtask" src="../assets/icons/board/delete.svg" alt="delete">
      `;
  }
}

/**
 * Updates the text of the currently edited subtask at the specified index
 * with the value from the corresponding input field.
 *
 * @param {number} index - The index of the subtask being edited.
 */
function currentEditSubtask(index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  currentSubtasks[index].text = inputField.value;
}

/**
 * Saves the current list of subtasks to the specified task in storage,
 * only if there are subtasks present in the currentSubtasks array.
 *
 * @param {number} id - The index of the task in the todoKeysArray to which the subtasks are being saved.
 */
function saveCurrentSubtask(i) {
  if (currentSubtasks.length > 0) {
    if (!currentTodos[i]['subtask']) {
      currentTodos[i]['subtask'] = [...currentSubtasks];
    } else {
      currentTodos[i]['subtask'] = [...currentTodos[i]['subtask'], ...currentSubtasks];
    }
    editTaskRemote(todoKeysArray[i], { subtask: currentTodos[i]['subtask'] });
  }
}

/**
 * Removes a subtask from the currentSubtasks array at the specified index
 * and re-renders the updated list of subtasks.
 *
 * @param {number} index - The index of the subtask to be removed.
 */
function removeAddedSubtask(index) {
  if (index === 'all') {
    currentSubtasks = [];
  } else {
    currentSubtasks.splice(index, 1);
  }
  renderSubtaskAddedList();
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

/**
 * Loads the priority of the current todo item and sets it as the active priority.
 * @param {number} i - The index of the todo item in the currentTodos array.
 */
function loadCurrentPriority(i) {
  let currentPrio = currentTodos[i].prio;
  activePriority = currentPrio;
}

/**
 * Sets the focus on the task details based on the current active priority.
 * It adds the 'active' class to the task element that matches the active priority
 * and removes it from the other task elements.
 */
function setFocusBasedOnPriority() {
  const priorities = ['urgent', 'medium', 'low'];
  priorities.forEach((prio) => {
    const element = document.getElementById(`${prio}DetailTask`);
    element.classList.toggle('active', activePriority === prio);
  });
}

/**
 * Sets the active priority based on the given priority value.
 * Updates the activePriority variable to match the provided priority ('urgent', 'medium', or 'low').
 * @param {string} priority - The priority to set ('urgent', 'medium', or 'low').
 */
function setPriorityColor(priority) {
  if (priority === 'urgent') {
    activePriority = 'urgent';
  } else if (priority === 'medium') {
    activePriority = 'medium';
  } else if (priority === 'low') {
    activePriority = 'low';
  }
}

/**
 * Changes the active priority and updates the focus based on the new priority.
 * Sets the activePriority and updates the UI to reflect the new priority's focus.
 * @param {string} priority - The new priority to set ('urgent', 'medium', or 'low').
 */
function changePriority(priority) {
  setPriorityColor(priority);
  setFocusBasedOnPriority();
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
