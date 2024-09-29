let todos = [];
let currentDraggedElement;

const BASE_URL =
  "https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/";

async function onload() {
  await loadTodosArray();
  updateHtml();

  // addTodo("Template", "Erstellung HTML Template", "Lars", "2017-01-01", "toDo", "Technical Task",);  //TODO Technical Task groß schreiben

  // addTodo("Recipe", "Erstellung neuen Rezept", "", "2017-01-01", "inProgress", "User Story",);
  // addTodo("Kochwelt", "Architecture", "Peter", "2017-03-01", "done", "User Story",);
}

function addTodo(
  title,
  description,
  assignedTo,
  dueDate,
  swimlane,
  task_category
) {
  postData("/todos", {
    title: title,
    description: description,
    assignedTo: assignedTo,
    dueDate: dueDate,
    swimlane: swimlane,
    task_category: task_category,
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
  // console.log("todosResponse ", todosResponse);
  // console.log("todoKeysArray", todoKeysArray);

  for (let i = 0; i < todoKeysArray.length; i++) {
    todos.push({
      id: i, //todoKeysArray[i]
      ...todosResponse[todoKeysArray[i]],
    });
  }
  console.log("todos", todos);
}

async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  //   console.log("responseAsJson", responseAsJson);
  return responseAsJson;
}

function updateHtml() {
    updateColumn("toDo", "toDoContent");
    updateColumn("inProgress", "inProgressContent");
    updateColumn("awaitFeedback", "awaitFeedbackContent");
    updateColumn("done", "doneContent");
}

function updateColumn(swimlane, contentId) {
    let tasks = todos.filter((t) => t["swimlane"] === swimlane);

    let content = document.getElementById(contentId);
    content.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
      const element = tasks[i];
        content.innerHTML += generateHtmlTemplate(i, tasks, element);
    }
}

function generateHtmlTemplate(i, task, element){
    return /*html*/ `
    <div class="task" draggable="true" ondragstart="startDragging(${element['id']})">
        <span class="task-category bg-${task[i].task_category.replace(/\s+/g, '-').toLowerCase()}">${task[i].task_category}</span>
        <div class="title">${task[i].title}</div>
        <div class="description">${task[i].description}</div>
    </div>`;
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(event) {
    event.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['swimlane'] = category;
    updateHtml();
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
