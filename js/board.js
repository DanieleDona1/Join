let todos = [];
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

  /*openTaskDetails(1);*/ /* TODO Delete*/
  // console.log(task[0].prio );
}

function updateColumn(category, contentId) {
  let tasks = todos.filter((t) => t["category"] === category);

  let content = document.getElementById(contentId);
  content.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const element = tasks[i];
    content.innerHTML += generateHtmlTemplate(i, tasks, element);
  }
}

function generateHtmlTemplate(i, task, element) {
  return /*html*/ `
    <div class="task" draggable="true" onclick="openTaskDetails(${element['id']})" ondragstart="startDragging(${element['id']})">
        <span class="task-category bg-${task[i].task_category
          .replace(/\s+/g, "-")
          .toLowerCase()}">${task[i].task_category}</span>
        <div class="title">${task[i].title}</div>
        <div class="description">${task[i].description}</div>
        <div class="subtasks"><!-- TODO -->TODO Subtask</div>
        <div class="d-flex-sb-c">
          <div class="members"><!-- TODO -->TODO Members</div>
          <img src="/assets/icons/board/${task[i].prio}.svg" alt="prio">
        </div>
    </div>`;
}

function generateDetailTaskTemplate(id) {
  let taskCategory = todos[id].task_category.replace(/\s+/g, "-").toLowerCase();
  let formattedDate = todos[id].dueDate.replace(/-/g, '/');
  return /*html*/ `
    <div class="detail-task slide-in" onclick="event.stopPropagation();">
        <div class="d-flex-sb-c">
          <span class="task-category bg-${taskCategory}">${todos[id].task_category}</span>
            <img class="xmark" onclick="closeDialog()" src="/assets/icons/board/xmark.svg" alt="xmark">
        </div>
        <div class="title">${todos[id].title}</div>
        <div class="description">${todos[id].description}</div>
        <div class="due-date color-blue">Due date:&nbsp; <span class="color-black">${formattedDate}</span></div><!-- Input type=date dieses Attribut hinzufügen: lang="de-DE" -->
        <div>
          <span class="color-blue">Priority:&nbsp; <span class="color-black">${todos[id].prio}</span></span>
          <img class="prio-img" src="/assets/icons/board/${todos[id].prio}.svg" alt="prio">
        </div>

        <div class="d-flex-sb-c">
          <div class="members color-blue">Assigned To: <div><!-- TODO --> TODO Add Members</div></div>
        </div>
        <div class="subtasks color-blue">Subtasks <div><!-- TODO --> TODO Subtask</div></div>
        <div class="configuration">
          <div><img src="/assets/icons/board/delete.svg" alt="delete"><span class="color-blue">Delete</span></div>
          <div class="separator "><img src="/assets/icons/board/edit.svg" alt="edit"><span class="color-blue">Edit</span></div>
    </div>`;
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(event) {
  event.preventDefault();
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
  document.getElementById("dialog").style.display = "flex";
  document.getElementById(
    "dialog"
  ).innerHTML = generateDetailTaskTemplate(id);
  // document.body.style.overflowY = "hidden";
}
function closeDialog() {
  document.getElementById("dialog").style.display = "none";

  // const dialog = document.getElementById('dialog');
  //   const content = dialog.querySelector('.dialog-content'); // Dialog-Inhalt finden

  //   if (content) {
  //       content.classList.add('slide-out'); // Herausfliegen-Animation starten
  //       content.addEventListener('animationend', function() {
  //           dialog.classList.add('d-none'); // Dialog nach der Animation verstecken
  //           dialog.innerHTML = ''; // Den Inhalt entfernen
  //       }, { once: true }); // Event-Listener wird nur einmal ausgeführt
  //   }

  // document.body.style.overflowY = "visible";
}
