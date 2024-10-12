let todos = [];
let currentTodos = [];
let todoKeysArray = [];
let currentDraggedElement;

const BASE_URL = 'https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/';

async function onload() {
  await loadTodosArray();
  updateHtml();
}
//TODO Technical Task groß schreiben
// addTask({
//   title: "BANANA",
//   description: "RAM",
//   dueDate: "2024-10-03",
//   category: "inProgress",
//   task_category: "Technical Task",
//   assignedTo: ["Test", "Test234"],
//   subtask: ["Array für subtask"],
//   prio: "Low",
// });

// addTask({
//   title: "Verion 2.0",
//   description: "Erstellung HTML CSS",
//   dueDate: "2019-06-02",
//   category: "toDo",
//   task_category: "User Story",
//   assignedTo: ["Max Mustermann", "Thomas Müller"],
//   subtask: ["Array für subtask"],
//   prio: "Urgent",
// });

// Funktion zum Hinzufügen einer Aufgabe
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

function testFunctionUpdateArray() {
  // TODO Delete Function
  editTask('-O8MxVcXTeF25AhrVK--', { subtask: todos[6].assignedTo });
}

// editTask("-O8MwcfV9U4KommG-LGU", {todos[id].subtask});
// editTask("-O8MwcfV9U4KommG-LGU", { title: "BANANA"});

function editTask(key, { title, description, dueDate, assignedTo, subtask, prio }) {
  // Senden der Daten an die API
  updateData(`/todos/${key}`, { title, description, dueDate, assignedTo, subtask, prio });
}

async function postData(path = '', data = {}) {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });  
  return (responseToJson = await response.json());
}

async function deleteData(path = '', data = {}) {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'DELETE',
  });
  return (responseToJson = await response.json());
}

async function updateData(path = '', data = {}) {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
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
    console.log("todos:",todos);
    
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
  console.log("currentTodos:", currentTodos);
}

function updateColumn(category, contentId) {
  let tasks = currentTodos.filter((t) => t['category'] === category);

  let content = document.getElementById(contentId);
  content.innerHTML = '';

  for (let i = 0; i < tasks.length; i++) {
    const element = tasks[i];
    content.innerHTML += generateHtmlTemplate(i, tasks, element);
    loadProgressText(i);
  }
}

async function createTask(category, contentId) {
  const userInputData = getUserAddTaskData();
  await addTask(userInputData);
  await loadTodosArray();
  updateColumn(category, contentId);
}

function getUserAddTaskData() {
  return {
    title: document.getElementById('title') || 'New2',
    dueDate: document.getElementById('dueDate') || '2012-03-09',
    category: 'toDo',
    description: document.getElementById('description') || 'No description provided.',
    task_category: document.getElementById('task_category') || 'User-Story', // User-Story Technical-Task wichtig großgeschrieben User-Story 
    assignedTo: document.getElementById('assignedTo') || ['Peter', 'Müller'] || 'Unassigned',
    subtask: document.getElementById('subtask') || [{text: "1111111", checked: false }, {text: "222222", checked: false }, {text: "3333333", checked: true }] || 'No subtasks',
    prio: document.getElementById('prio') || 'Low',
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

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(event) {
  // console.log('Event:', event); TODO
  event.preventDefault();
  event.stopPropagation();
}

function moveTo(category) {
  todos[currentDraggedElement]['category'] = category;
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
  generateAssignedTo(id);
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

function createEditTask(id) {
  // TODO if required nicht leer --> getInputfields values --> todos = currentTodos --> udateHtml(); --> generateDetailTaskTemplate(id) --> editTask(); für remote
  // else --> message required -->
}

function loadProgressText(i) {
  let progressText = document.getElementById('progressText' + i);
  let progressBar = document.getElementById('progressBar' + i);
  if(progressText){
    progressText.innerHTML = '';
  }
  // Create Array subtask.text
  let subtaskTexts = currentTodos[i].subtask.map(sub => sub.text);
  let subtaskStatus = currentTodos[i].subtask.filter(sub => sub.checked === true);
  let totalSubtasks = subtaskTexts.length;
  let completedTasks = subtaskStatus.length;

  progressText.innerHTML = /*html*/`
    ${completedTasks} / ${totalSubtasks} Subtasks
    `;
    let progressValue = completedTasks  / totalSubtasks * 100;
  progressBar.style.width =  `${progressValue}%`;
}

function generateSubtaskList() {
    let subtasksAreahtml = document.getElementById('subtasksAreahtml' + i); //an der stelle i
    for (let i = 0; i < subtaskTexts.length; i++) {
      subtasksAreahtml.innerHTML += `<div>${subtaskTexts[i]}</div>`;
    }
  }
    // let totalSubtasks = subtaskTexts[i].length;


    // console.log("subtaskTexts", subtaskTexts);
    // console.log("totalSubtasks", totalSubtasks);
    
    // let subtaskChecked = currentTodos.flatMap(todo => 
    //   todo.subtask.filter(sub => sub.checked === true));
    //   let totalChecked = subtaskChecked[i].length;

      // console.log("subtaskChecked", subtaskChecked);
      // console.log("totalChecked", totalChecked);


    
