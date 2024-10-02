let todos = [];
let currentTodos = [];

let currentDraggedElement;

const BASE_URL =
  "https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/";

async function onload() {
  await loadTodosArray();
  updateHtml();
  //TODO Technical Task groß schreiben
  // addTodo("Template", "Erstellung HTML Template", "2012-03-09", "done", "Technical Task", ["Daniel", "Fabian"], ["ein Aray für subtask"], "Medium" );
  // addTodo("Architecture", "Erstellung CSS", "2013-01-01", "toDo", "User Story", ["Anna", "Fabian"], ["ein Aray für subtask"], "Urgent" );
  // addTodo("Headline", "Erstellung HTML Template", "2019-06-02", "awaitFeedback", "Technical Task", ["Sabine", "Fabian"], ["ein Aray für subtask"], "Low" );
  // addTodo("Create new function", "Erstellung HTML Template", "2014-08-03", "inProgress", "User Story", ["Lars", "Fabian"], ["ein Aray für subtask"], "Medium" );
  // addTodo("Template function", "Erstellung HTML Template", "2015-09-04", "awaitFeedback", "Technical Task", ["Karl", "Fabian"], ["fff"], "urgent" );
  // addTodo("Team Meeting", "Erstellung HTML Template", "2016-03-05", "toDo", "User Story", ["Peter", "Fabian"], ["ein Aray für subtask"], "Low" );
}

function addTodo(
  title,
  description,
  dueDate,
  category,
  task_category,
  assignedTo,
  subtask,
  prio
) {
  postData("/todos", {
    title: title,
    description: description,
    dueDate: dueDate,
    category: category,
    task_category: task_category,
    assignedTo: assignedTo,
    subtask: subtask,
    prio: prio,
  });
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

// fills up the firebase to todos array
async function loadTodosArray() {
  let todosResponse = await getAllUsers("todos");
  let todoKeysArray = Object.keys(todosResponse);

  for (let i = 0; i < todoKeysArray.length; i++) {
    todos.push({
      id: i, //todoKeysArray[i]
      ...todosResponse[todoKeysArray[i]],
    });
  }
  currentTodos = todos;
  console.log("todos", todos);
}

async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

function updateHtml() {
  updateColumn("toDo", "toDoContent");
  updateColumn("inProgress", "inProgressContent");
  updateColumn("awaitFeedback", "awaitFeedbackContent");
  updateColumn("done", "doneContent");
}

function updateColumn(category, contentId) {
  let tasks = currentTodos.filter((t) => t["category"] === category);

  let content = document.getElementById(contentId);
  content.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const element = tasks[i];
    content.innerHTML += generateHtmlTemplate(i, tasks, element);
  }
}

function createTask(category, contentId) {
  //Neue Funktion getAllDatadocumentElementById TITLE, DESCRIPTION ASIGNEDTO, ... Input Daten in todos.push() oder firebase auch(Funktion vorhanden)
  updateColumn(category, contentId);
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
  todos[currentDraggedElement]["category"] = category;
  updateHtml();

  removeHighlightAfterDrop();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function removeHighlightAfterDrop() {
  let contentElements = document.getElementsByClassName("content");
  for (let i = 0; i < contentElements.length; i++) {
    contentElements[i].classList.remove("drag-area-highlight");
  }
  document
    .getElementById("doneContent")
    .classList.remove("drag-area-highlight");
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
  return document.querySelectorAll(".content");
}

function checkAndInsertText(contentElements) {
  contentElements.forEach((element) => {
    if (element.innerHTML.trim() === "") {
      element.innerHTML = `<div class="no-task">No task to do</div>`;
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

document.addEventListener("DOMContentLoaded", init);

function openTaskDetails(id) {
  document.getElementById("dialog").innerHTML = generateDetailTaskTemplate(id);
  // document.body.style.overflowY = "hidden";
  openDialog();
}

function openDialog() {
  document.getElementById("dialog").style.display = "flex";
}

function closeDialog() {
  // document.body.style.overflowY = "visible";
  animationSlideOut();
  let filled = document.getElementById("search").value;
  if (filled != "") {
    currentTodos = todos;
    updateHtml();
  }
}

function deleteTask(id) {
  todos = todos.filter((t) => t.id !== id);
  todos.forEach((element, i) => {
    element.id = i;
  });
  currentTodos = todos;
  closeDialog();
  updateHtml();
}

function searchTitleOrDescription() {
  let filterWord = document.getElementById("search").value.toLowerCase(); // Suchbegriff in Kleinbuchstaben
  currentTodos = todos.filter((t) =>
      t.title.toLowerCase().includes(filterWord) ||
      t.description.toLowerCase().includes(filterWord)
  );
  updateHtml();
}

function animationSlideOut() {
  const dialog = document.getElementById("dialog");
  const content = dialog.querySelector(".dialog-content");

  content.classList.add("slide-out");
  content.addEventListener(
    "animationend",
    function () {
      dialog.style.display = "none";
      dialog.classList.add("d-none");
      // dialog.innerHTML = '';
    },
    { once: true }
  );
}
