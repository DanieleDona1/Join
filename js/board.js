let todos = [];
let currentTodos = [];
let todoKeysArray = [];
let currentDraggedElement;

const BASE_URL = 'https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/';

//Load all tasks from firebase
async function onload() {
  await loadTodosArray();
  updateHtml();
}

async function loadTodosArray() {
  let todosResponse = await getAllUsers('todos');
  if (todosResponse) {
    todoKeysArray = Object.keys(todosResponse);
    todos = [];

    for (let i = 0; i < todoKeysArray.length; i++) {
      todos.push({
        id: i,
        ...todosResponse[todoKeysArray[i]],
      });
    }
    currentTodos = todos;
    console.log('todos:', todos);
  } else {
    console.log('No todos found, Database is empty');
  }
}

async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + '.json');
  let responseAsJson = await response.json();
  return responseAsJson;
}

function updateHtml() {
  updateColumn('toDo', 'toDoContent');
  updateColumn('inProgress', 'inProgressContent');
  updateColumn('awaitFeedback', 'awaitFeedbackContent');
  updateColumn('done', 'doneContent');
  console.log('currentTodos:', currentTodos);
}

function updateColumn(category, contentId) {
  let tasks = currentTodos.filter((t) => t['category'] === category);
  let content = document.getElementById(contentId);
  content.innerHTML = '';

  for (let i = 0; i < tasks.length; i++) {
    const element = tasks[i];
    content.innerHTML += generateHtmlTemplate(i, tasks, element);

    loadProgressText(element['id']);
  }
}

function loadProgressText(i) {
  let progressText = document.getElementById('progressText' + i);
  let progressBar = document.getElementById('progressBar' + i);
  if (progressText) {
    progressText.innerHTML = '';
  }
  let subtaskTexts = currentTodos[i].subtask.map((sub) => sub.text);
  let subtaskStatus = currentTodos[i].subtask.filter((sub) => sub.checked === true);
  let totalSubtasks = subtaskTexts.length;
  let completedTasks = subtaskStatus.length;

  progressText.innerHTML = /*html*/ `
    ${completedTasks} / ${totalSubtasks} Subtasks
    `;
  let progressValue = (completedTasks / totalSubtasks) * 100;
  progressBar.style.width = `${progressValue}%`;
}

// Funktion zum Hinzufügen einer Aufgabe
function testFunctionUpdateArray(i) {
  editTask(todoKeysArray[0], { subtask: todos[i].subtask });
}

function editTask(key, { title, description, category, dueDate, assignedTo, subtask, prio }) {
  // Senden der Daten an die API
  patchData(`/todos/${key}`, { title, description, category, dueDate, assignedTo, subtask, prio });
}

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

async function createTask(category, contentId) {
  const userInputData = getUserAddTaskData(category);
  await addTask(userInputData);
  await loadTodosArray();
  updateColumn(category, contentId);
}

function getUserAddTaskData(swimlane) {
  return {
    title: document.getElementById('title') || 'Javascript',
    dueDate: document.getElementById('dueDate') || '2012-03-09',
    category: swimlane,
    description: document.getElementById('description') || 'No description provided.',
    task_category: document.getElementById('task_category') || 'User-Story', // User-Story Technical-Task wichtig großgeschrieben User-Story
    assignedTo: document.getElementById('assignedTo') || ['Peter', 'Müller'] || 'Unassigned',
    subtask:
      document.getElementById('subtask') || [
        { text: 'aaaaaa', checked: false },
        { text: 'bbbbbb', checked: false },
        { text: 'cccc', checked: true },
      ] ||
      'No subtasks',
    prio: document.getElementById('prio') || 'Urgent',
  };
}

function convertArraytoObject(arr) {
  if (Array.isArray(arr)) {
    let myObject = {};
    arr.forEach((member, index) => {
      myObject[`member${index}`] = member;
    });
    return myObject;
  }
}

function convertObjectToArray(obj) {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.values(obj);
  }
}

//Drag&Drop function
function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(event) {
  event.preventDefault();
  event.stopPropagation();
}

function moveTo(newCategory) {
  // console.log("currentDraggedElement", currentDraggedElement);
  // console.log("newCategory: ", newCategory);

  todos[currentDraggedElement]['category'] = newCategory;
  // console.log("Nach drop category:", todos[currentDraggedElement]['category']);

  editTask(todoKeysArray[currentDraggedElement], { category: todos[currentDraggedElement].category});
  console.log(todoKeysArray[currentDraggedElement], todos[currentDraggedElement].category);


  console.log("nachdrop bevor updateHtml Todo:", todos);


  updateHtml();

  removeHighlightAfterDrop();
}

function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

function removeHighlightAfterDrop() {
  let contentElements = document.getElementsByClassName('content');
  for (let i = 0; i < contentElements.length; i++) {
    contentElements[i].classList.remove('drag-area-highlight');
  }
  document.getElementById('doneContent').classList.remove('drag-area-highlight');
}

// Fill up empty content section
function init() {
  const contentElements = getContentElements();

  checkAndInsertText(contentElements);

  const config = { childList: true };
  const observer = createMutationObserver(mutationCallback);

  observeContentElements(observer, contentElements, config);
}

function getContentElements() {
  return document.querySelectorAll('.content');
}

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

function createMutationObserver(callback) {
  return new MutationObserver(callback);
}

function observeContentElements(observer, contentElements, config) {
  contentElements.forEach((element) => {
    observer.observe(element, config);
  });
}

function mutationCallback(mutationsList, observer) {
  mutationsList.forEach(() => {
    checkAndInsertText(getContentElements());
  });
}

function changeTextContentDone() {
  let parentElement = document.getElementById('doneContent');
  let firstChild = parentElement.children[0];
  firstChild.textContent = 'No task done';
}

document.addEventListener('DOMContentLoaded', init);

function openTaskDetails(id) {
  document.getElementById('dialog').innerHTML = generateDetailTaskTemplate(id);
  // generateAssignedTo(id);
  loadSubtaskList(id);
  // document.body.style.overflowY = "hidden";
  openDialog();
}

function openDialog() {
  document.getElementById('dialog').style.display = 'flex';
}

function closeDialog() {
  // document.body.style.overflowY = "visible";
  animationSlideOut();
  let filled = document.getElementById('search').value;
  if (filled != '') {
    currentTodos = todos;
    updateHtml();
  }
  currentTodos = todos;
}

function deleteTask(id) {
  todos = todos.filter((t) => t.id !== id);
  todos.forEach((element, i) => {
    element.id = i;
  });
  currentTodos = todos;

  closeDialog();
  updateHtml();

  deleteData(`/todos/${todoKeysArray[id]}`);
  let newTodoKeysArray = todoKeysArray.filter((t) => t !== todoKeysArray[id]);
  todoKeysArray = newTodoKeysArray;
}

//function searchbar
function searchTitleOrDescription(inputId) {
  let filterWord = document.getElementById(inputId).value.trim().toLowerCase();
  console.log(filterWord);

  currentTodos = todos.filter((t) => (t.title && t.title.toLowerCase().includes(filterWord)) || (t.description && t.description.toLowerCase().includes(filterWord)));
  updateHtml();
}

function animationSlideOut() {
  const dialog = document.getElementById('dialog');
  const content = dialog.querySelector('.dialog-content');

  content.classList.add('slide-out');
  content.addEventListener(
    'animationend',
    function () {
      dialog.style.display = 'none';
      dialog.classList.add('d-none');
      // dialog.innerHTML = '';
    },
    { once: true }
  );
}

//load subtask, update progressbar, update firebase
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
    subtasksList.innerHTML += generateSubtaskList(i , j, checkboxImgUrl, subtaskTexts);
  }
}

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
  loadProgressText(i);
  editTask(todoKeysArray[i], { subtask: todos[i].subtask });
}
