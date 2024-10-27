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
  currentTodos = todos;
  console.log('todos in loadArray():', todos);
  console.log('currtodos in loadArray():', currentTodos);
  renderTasks();

  openTaskDetails(0);
  generateEditTemplate(0);
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
  currentTodos = todos;
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
    console.log('task:', task);
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

  if (progressText) {
    progressText.innerHTML = '';
  }
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
  currentTodos = todos;
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
    title: document.getElementById('title') || 'Test',
    dueDate: document.getElementById('dueDate') || '2024-03-10',
    category: swimlane,
    description: document.getElementById('description') || 'No description provided.',
    task_category: document.getElementById('task_category') || 'User-Story', // User-Story Technical-Task wichtig großgeschrieben User-Story
    assignedTo: document.getElementById('assignedTo') || ['Peter', 'Müller'] || 'Unassigned',
    subtask:
      document.getElementById('subtask') || [
        { text: 'aaaaaa', checked: false },
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
    currentTodos = todos;
    renderTasks();
  }
  currentTodos = todos;
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
  currentTodos = todos;

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
 * Toggles the checkbox image for a subtask and updates its checked status.
 * @param {number} i - The index of the main task.
 * @param {number} j - The index of the subtask.
 */
function toggleCheckboxUrl(i, j) {
  let checkboxImg = document.getElementById('checkboxImg' + j);
  let currentUrl = checkboxImg.style.backgroundImage;
  let changeCheckedStatus = todos[i].subtask[j];
  if (currentUrl.includes('checkbox-unchecked.svg')) {
    checkboxImg.style.backgroundImage = "url('/assets/icons/board/checkbox-checked.svg')";
    changeCheckedStatus.checked = true;
  } else {
    checkboxImg.style.backgroundImage = "url('/assets/icons/board/checkbox-unchecked.svg')";
    changeCheckedStatus.checked = false;
  }
  const { progressText, progressBar } = initializeProgressElements(i);
  loadProgressText(currentTodos[i], progressText, progressBar);
  editTask(todoKeysArray[i], { subtask: todos[i].subtask });
}

// function formatDateToInput(id) { /*TODO*/
//   let dueDateStr = todos[id].dueDate
//   const [day, month, year] = dueDateStr.split("-");
//   return `${year}-${month}-${day}`;
// }
function focusInput() {
  document.getElementById('subtaskInput').focus();
  console.log('currentTodos:', currentTodos);
}

function onInputSubtask(id) {
  document.getElementById('subtaskIcons').innerHTML = /*html*/ `
    <div class="d-flex-c-c">
      <img onclick="focusInput(); resetInputField();" class="add-subtask" src="/assets/icons/board/property-close.svg" alt="close">
      <img class="mg-left" onclick="saveCurrentSubtask(${id})" class="add-subtask" src="/assets/icons/board/property-check.svg" alt="check">
    </div>
  `;
}

function saveCurrentSubtask(id) {
  // <!-- &bull; -->
  let subtaskText = document.getElementById('subtaskInput');
  let todosLength = todos[id]['subtask'].length
  currentTodos[id]['subtask'].push({ checked: false, text: subtaskText.value });

  renderSubtaskAddedList(todosLength, id, subtaskText);

  resetInputField();
}

function renderSubtaskAddedList(todosLength, id, subtaskText) {
  let subtaskAddedList = document.getElementById('subtaskAddedList');
  for (let i = todosLength; i < currentTodos[id]['subtask'].length; i++) {
    subtaskAddedList.innerHTML += generateSubtaskAddedListTemplate(i, subtaskText);
  }
}

function generateSubtaskAddedListTemplate(i, subtaskText) {
  return /*html*/ `
  <div class="subtask-item${i} subtask-group subtask-list-group">
    <input onclick="readonlyToggle(${i});" id="subtaskListInput${i}" readonly class="subtask-input" type="text" value="${subtaskText.value}">
    <div id="subtaskListIcons" class="subtask-list-icons">
      <div id="subtaskAddedListIcons" class="d-flex-c-c">
        <img onclick="readonlyToggle(${i});" class="add-subtask" src="/assets/icons/board/edit.svg" alt="edit">
        <img class="mg-left" class="add-subtask" src="/assets/icons/board/delete.svg" alt="check">
      </div>
    </div>
    `;
}

function readonlyToggle(index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  inputField.readOnly = !inputField.readOnly;
  if (!inputField.readOnly) {
      inputField.focus();
      inputField.setSelectionRange(inputField.value.length, inputField.value.length);
  }

  let subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons');
  subtaskAddedListIcons.innerHTML = /*html*/`
      <img onclick="removeAddedSubtask(index)" class="add-subtask" src="/assets/icons/board/property-delete.svg" alt="close">
      <img class="mg-left" onclick="editAddedSubtask(index)" class="add-subtask" src="/assets/icons/board/property-check.svg" alt="check"></img>`;
}

function resetInputField() {
  document.getElementById('subtaskInput').value = '';
  document.getElementById('subtaskIcons').innerHTML = /*html*/ `
    <img onclick="focusInput()" class="add-subtask" src="/assets/icons/board/property-add.svg" alt="add">`;
}

function createEditTask(i) {
  todos = currentTodos;

  //hier weitere Felder hinzufügen saveTitle, saveDescription, saveDueDate
  saveSubtaskAddedList(i);

  closeDialog();
}

function saveSubtaskAddedList(i) {
  if (document.getElementById('subtaskAddedList').innerHTML !== '') {
    editTask(todoKeysArray[i], { subtask: todos[i].subtask });
  }
}

function editItem(listItem) {
  // Speichere den aktuellen Text
  const currentText = listItem.innerText;

  // Erstelle ein Eingabefeld und setze den aktuellen Text
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentText;
}
