let currentDraggedElement;

/**
 * Loads all tasks from Firebase and renders them.
 *
 * @async
 * @function onload
 * @returns {Promise<void>}
 */
async function onload() {
  await loadTodosArray();
  currentTodos = JSON.parse(JSON.stringify(todos));
  console.log('todos in loadArray():', todos);
  console.log('currtodos in loadArray():', currentTodos);
  renderTasks();

  // openTaskDetails(0);
  // generateEditTemplate(0);
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

  // if (progressText) {
  //   progressText.innerHTML = '';
  // }
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
  let completedTasks = task.subtask.filter((sub) => sub.checked === true).length;
  let totalSubtasks = task.subtask.length;

  progressText.innerHTML = /*html*/ `
      ${completedTasks} / ${totalSubtasks} Subtasks
      `;
  let progressValue = (completedTasks / totalSubtasks) * 100;
  progressBar.style.width = `${progressValue}%`;
}

/**
 * Edits a task's properties and sends the update to the API.
 *
 * @function editTask
 * @param {string} key - The task key.
 * @param {Object} taskData - The updated task data.
 * @returns {void}
 */
function editTask(key, { title, description, category, dueDate, assignedTo, subtask, prio }) {
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
    title: document.getElementById('title') || 'HTML',
    dueDate: document.getElementById('dueDate') || '2024-03-10', //Format sollte so sein wenn ich mich nicht täusche ;)
    category: swimlane,
    description: document.getElementById('description') || 'No description provided.',
    task_category: document.getElementById('task_category') || 'User-Story', // User-Story Technical-Task wichtig großgeschrieben User-Story
    assignedTo: document.getElementById('assignedTo') || ['Peter', 'Müller'] || 'Unassigned',
    subtask: document.getElementById('subtask') || [
        { text: 'aaajkglgjkhgjhgjhghjgjjkhz kjlhkjhkjhlkjhlkjhlkjMM hkjhhgjhgjhgjhgjhgaa', checked: false },
        { text: 'bbbbbb', checked: false },
        { text: 'cccc', checked: false },
      ] ||
      'No subtasks',
    prio: document.getElementById('prio') || 'Urgent',
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
  editTask(todoKeysArray[currentDraggedElement], { category: todos[currentDraggedElement].category });
  // currentTodos = todos;
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
  document.getElementById('dialog').innerHTML = generateDetailTaskTemplate(id);
  // generateAssignedTo(id);
  loadSubtaskList(id);
  // document.body.style.overflowY = "hidden";
  openDialog();
}

/**
 * Displays the dialog for task details.
 */
function openDialog() {
  document.getElementById('dialog').style.display = 'flex';
}

/**
 * Closes the task details dialog and resets the search field if necessary.
 */
function closeDialog() {
  animationSlideOut();
  let filled = document.getElementById('search');
  if (filled.value != '') {
    filled.value = '';
    currentTodos = JSON.parse(JSON.stringify(todos));
    renderTasks();
  }
  currentTodos = JSON.parse(JSON.stringify(todos));
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
  let filterWord = document.getElementById(inputId).value.trim().toLowerCase();
  console.log(filterWord);

  currentTodos = todos.filter((t) => (t.title && t.title.toLowerCase().includes(filterWord)) || (t.description && t.description.toLowerCase().includes(filterWord)));
  renderTasks();
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
 * Loads the subtasks for a given task and updates the display.
 * @param {number} i - The index of the task in the currentTodos array.
 */
function loadSubtaskList(i) {
  let subtaskStatus = currentTodos[i].subtask.map((sub) => sub.checked);
  let subtaskTexts = currentTodos[i].subtask.map((sub) => sub.text);
  let subtasksList = document.getElementById('subtasksList');

  for (let j = 0; j < subtaskTexts.length; j++) {
    if (subtaskStatus[j]) {
      checkboxImgUrl = '/assets/icons/board/checkbox-checked.svg';
    } else {
      checkboxImgUrl = '/assets/icons/board/checkbox-unchecked.svg';
    }
    subtasksList.innerHTML += generateSubtaskList(i, j, checkboxImgUrl, subtaskTexts);
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
    checkboxImg.style.backgroundImage = "url('/assets/icons/board/checkbox-checked.svg')";
  } else {
    checkboxImg.style.backgroundImage = "url('/assets/icons/board/checkbox-unchecked.svg')";
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
  editTask(todoKeysArray[i], { subtask: todos[i].subtask }); // Lokale Speicherung
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
 * Updates the subtask icons based on the input state.
 *
 * @param {number} id - The ID of the current todo item.
 */
function onInputSubtask(id) {
  let subtaskInput = document.getElementById('subtaskInput');
  if (subtaskInput.value !== '') {
  document.getElementById('subtaskIcons').innerHTML = /*html*/ `
    <div class="d-flex-c-c">
      <img onclick="focusInput(); resetInputField(${id});" class="add-subtask" src="/assets/icons/board/property-close.svg" alt="close">
      <img class="mg-left" onclick="saveCurrentSubtask(${id})" class="add-subtask" src="/assets/icons/board/property-check.svg" alt="check">
    </div>
  `;
  } else {
    resetInputField()
  }
}

/**
 * Retrieves the value from the subtask input field and prepends a bullet point.
 * @returns {string} The subtask text with a bullet point.
 */
function getSubtaskWithBullet() {
  let subtaskText = document.getElementById('subtaskInput');
  let bulletPoint = '• ';
  return bulletPoint + subtaskText.value;
}

/**
 * Saves the current subtask with a bullet point and renders the updated list.
 * @param {number} id - The ID of the current todo item.
 */
function saveCurrentSubtask(id) {
  let subtaskValueWithBullet = getSubtaskWithBullet();
  currentTodos[id]['subtask'].push({ checked: false, text: subtaskValueWithBullet });

  renderSubtaskAddedList(id);
  resetInputField();
}


/**
 * Focuses the subtask input field if it exists.
 */
function focusInput() {
  let subtaskInput = document.getElementById('subtaskInput');
  if (subtaskInput) {
    subtaskInput.focus();
  }
}

/**
 * Renders the list of added subtasks.
 *
 * @param {number} id - The ID of the current todo item.
 */
function renderSubtaskAddedList(id) {
  let todosLength = todos[id]['subtask'].length;
  let subtaskAddedList = document.getElementById('subtaskAddedList');
  subtaskAddedList.innerHTML = '';

  for (let i = todosLength; i < currentTodos[id]['subtask'].length; i++) {
    subtaskAddedList.innerHTML += generateSubtaskAddedListTemplate(id, i);
  }
}

/**
 * Resets the input field and its associated icons.
 */
function resetInputField() {
  document.getElementById('subtaskInput').value = '';
  document.getElementById('subtaskIcons').innerHTML = /*html*/ `
    <img onclick="focusInput()" class="add-subtask" src="/assets/icons/board/property-add.svg" alt="add">`;
}

/**
 * Toggles the readonly state of a subtask input field.
 *
 * @param {number} id - The ID of the current todo item.
 * @param {number} index - The index of the subtask.
 */
function readonlyToggle(id, index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  const subtaskItem = document.getElementById(`subtask-item${index}`);

  toggleReadOnly(inputField);

  if (!inputField.readOnly) {
    focusInputField(inputField);
    updateIconsOnFocus(id, index);
    preventRemoveIconFocus(id, index);
    addFocusOutListener(inputField, subtaskItem, id, index);
  }
}

/**
 * Toggles the readonly state of the input field.
 *
 * @param {HTMLInputElement} inputField - The input field to toggle.
 */
function toggleReadOnly(inputField) {
  inputField.readOnly = !inputField.readOnly;
}

/**
 * Focuses the input field and sets the selection range.
 *
 * @param {HTMLInputElement} inputField - The input field to focus.
 */
function focusInputField(inputField) {
  inputField.focus();
  inputField.setSelectionRange(inputField.value.length, inputField.value.length);
}

/**
 * Prevents focus on the remove icon when clicked.
 *
 * @param {number} id - The ID of the current todo item.
 * @param {number} index - The index of the subtask.
 */
function preventRemoveIconFocus(id, index) {
  const removeIconOnFocus = document.getElementById(`removeIconOnFocus${index}`);
  if (removeIconOnFocus) {
    removeIconOnFocus.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
  }
}

/**
 * Adds a focus out listener to the input field.
 *
 * @param {HTMLInputElement} inputField - The input field to add the listener to.
 * @param {HTMLElement} subtaskItem - The parent subtask item element.
 * @param {number} id - The ID of the current todo item.
 * @param {number} index - The index of the subtask.
 */
function addFocusOutListener(inputField, subtaskItem, id, index) {
  const handleFocusOut = (event) => {
    if (shouldHandleFocusOut(event, subtaskItem)) {
      handleSubtaskEdit(id, index);
      updateIconsOffFocus(id, index);
      inputField.readOnly = true;
      document.removeEventListener('focusout', handleFocusOut);
    }
  };
  inputField.addEventListener('focusout', handleFocusOut);
}

/**
 * Determines whether to handle focus out events.
 *
 * @param {FocusEvent} event - The focus out event.
 * @param {HTMLElement} subtaskItem - The parent subtask item element.
 * @returns {boolean} True if focus out should be handled, false otherwise.
 */
function shouldHandleFocusOut(event, subtaskItem) {
  return !subtaskItem.contains(event.relatedTarget) && event.relatedTarget?.id !== 'removeIconOnFocus';
}

/**
 * Handles the editing of a subtask when focus is lost.
 *
 * @param {number} id - The ID of the current todo item.
 * @param {number} index - The index of the subtask.
 */
function handleSubtaskEdit(id, index) {
  if (currentTodos[id]['subtask'][index]) {
    currentEditSubtask(id, index);
  }
}

/**
 * Updates the icons displayed when the input field is focused.
 *
 * @param {number} id - The ID of the current todo item.
 * @param {number} index - The index of the subtask.
 */
function updateIconsOnFocus(id, index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  subtaskAddedListIcons.innerHTML = /*html*/ `
      <img id="removeIconOnFocus${index}" onclick="removeAddedSubtask(${id}, ${index});" class="add-subtask" src="/assets/icons/board/property-delete.svg" alt="delete">
      <img class="mg-left" onclick="currentEditSubtask(${id}, ${index})" class="add-subtask" src="/assets/icons/board/property-check.svg" alt="check">
    `;
}

/**
 * Updates the icons displayed when the input field is not focused.
 *
 * @param {number} id - The ID of the current todo item.
 * @param {number} index - The index of the subtask.
 */
function updateIconsOffFocus(id, index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  if (subtaskAddedListIcons) {

    subtaskAddedListIcons.innerHTML = /*html*/ `
      <img onclick="readonlyToggle(${index});" class="add-subtask" src="/assets/icons/board/edit.svg" alt="edit">
      <img class="mg-left" onclick="removeAddedSubtask(${id}, ${index})" class="add-subtask" src="/assets/icons/board/delete.svg" alt="delete">
      `;
    }
}

/**
 * Updates the current text of the subtask when edited.
 *
 * @param {number} id - The ID of the current todo item.
 * @param {number} index - The index of the subtask.
 */
function currentEditSubtask(id, index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  currentTodos[id]['subtask'][index].text = inputField.value;
}

/**
 * Saves the added subtasks for a given todo item.
 *
 * @param {number} i - The index of the todo item in the list.
 */
function saveSubtaskAddedList(i) {
  if (document.getElementById('subtaskAddedList').innerHTML !== '') {
    editTask(todoKeysArray[i], { subtask: currentTodos[i].subtask });
  }
}

/**
 * Removes a subtask from the list.
 *
 * @param {number} id - The ID of the current todo item.
 * @param {number} index - The index of the subtask to remove.
 */
function removeAddedSubtask(id, index) {
  currentTodos[id]['subtask'].splice(index, 1);
  renderSubtaskAddedList(id);
}

/**
 * Creates and saves an edited task.
 *
 * @param {number} i - The index of the todo item being edited.
 */
function createEditTask(i) {
  todos = JSON.parse(JSON.stringify(currentTodos));

  //hier weitere Felder hinzufügen saveTitle, saveDescription, saveDueDate
  saveSubtaskAddedList(i);

  closeDialog();
}
