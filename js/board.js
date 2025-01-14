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
  initObserver();
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
function loadMembersInitials(taskId, initialsContainerId) {
  if (currentTodos[taskId].assignedTo) {
    selectedContactsKeys = getSelectedContactsKey(taskId);
    const membersContainer = document.getElementById(initialsContainerId + taskId);
    membersContainer.innerHTML = '';
    let addedCount = 0;
    for (let j = 0; j < selectedContactsKeys.length; j++) {
      selectedContacts = contactList.filter((f) => f.id === selectedContactsKeys[j]);

      const name = getName(selectedContacts[0]);
      const initialsName = generateInitials(name);

      if (initialsName && addedCount < 3) {
        membersContainer.innerHTML += memberHtmlTemplate(initialsName);
        addedCount++;
      } else if (addedCount < 4) {
        let collectedMembers = selectedContactsKeys.length - addedCount;
        membersContainer.innerHTML += memberCollected(collectedMembers, taskId);
        addedCount++;
      }
    }
  }
}

/**
 * Generates an HTML snippet for displaying the count of collected members in a task.
 * The snippet includes a clickable element that triggers the expansion of all member initials.
 *
 * @param {number} counter - The number of collected members to display.
 * @param {string} taskId - The ID of the task to associate with the member collection.
 * @returns {string} The HTML markup string for the member collection element.
 */
function memberCollected(counter, taskId) {
  return /*html*/ `
    <div class="initial-board-wrapper" onclick="event.stopPropagation(); expandAllMemberInitials('${taskId}', '${'membersContainer'}')">
      <div class="initial-board d-flex-c-c member-collected">+${counter}</div>
    </div>
    `;
}

/**
 * Loads the assigned members for a task and displays their initials in the respective container.
 * Array are used contactList - createContactlistAddTask() and keys-currentTodos[i].assignedTo and selectedContacts.
 */
function expandAllMemberInitials(taskId, initialsContainerId) {
  if (currentTodos[taskId].assignedTo) {
    selectedContactsKeys = getSelectedContactsKey(taskId);
    let membersContainer = document.getElementById(initialsContainerId + taskId);
    membersContainer.innerHTML = '';
    for (let j = 0; j < selectedContactsKeys.length; j++) {
      selectedContacts = contactList.filter((f) => f.id === selectedContactsKeys[j]);

      const name = getName(selectedContacts[0]);
      const initialsName = generateInitials(name);

      if (initialsName) {
        membersContainer.innerHTML += memberHtmlTemplate(initialsName);
      }
    }
    membersContainer.innerHTML += closeMemberBtn(taskId);
  }
}

/**
 * Generates an HTML snippet for a button that closes or resets the member initials view.
 * The snippet includes a clickable element that triggers the reloading of the member initials for the specified task.
 *
 * @param {string} taskId - The ID of the task to reload the member initials for.
 * @returns {string} The HTML markup string for the close button element.
 */
function closeMemberBtn(taskId) {
  return /*html*/ `
    <div class="initial-board-wrapper" onclick="event.stopPropagation(); loadMembersInitials('${taskId}', 'membersContainer')">
      <div class="initial-board d-flex-c-c member-collected">X</div>
    </div>
    `;
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
 * Opens the edit dialog for a specific task.
 *
 * @param {number} id - The ID of the task to be edited.
 */
function openEditTask(id) {
  const dueDate = todos[id].dueDate;
  document.getElementById('dialog').innerHTML = generateEditTemplate(id, dueDate);
  setFocusBasedOnPriority();
  renderSubtaskAddedList();
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
