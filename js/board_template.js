/**
 * Generates the HTML template for a task.
 * @param {Object} task - The task object containing task details.
 * @returns {string} - The HTML string representing the task.
 */
function generateHtmlTemplate(task) {
  let taskCategory = task.task_category.replace(/-/g, ' ');
  return /*html*/ `
      <div class="task" draggable="true" onclick="openTaskDetails(${task['id']})" ondragstart="startDragging(${task['id']})">
          <div class="task-category bg-${task.task_category}">${taskCategory}</div>
          <div class="title">${task.title}</div>
          <div class="description">${task.description}</div>

          <div class="subtasks">
            <div class="progress-container">
                <div id="progressBar${task['id']}" class="progress-bar"></div>
            </div>
                <div id="progressText${task['id']}" class="progress-text">Subtasks</div>
          </div>

          <div class="d-flex-sb-c">
            <div id="membersContainer${task['id']}" class="members-container d-flex-fs-c"></div>
          </div>
          <img draggable="false" src="/assets/icons/board/${task.prio}.svg" alt="prio">
      </div>`;
}

/**
 * Generates the detailed HTML template for a specific task.
 * @param {number} id - The ID of the task to display details for.
 * @returns {string} - The HTML string for the detailed task view.
 */
function generateDetailTaskTemplate(id) {
  const dueDate = todos[id].dueDate;
  let priority = todos[id].prio.charAt(0).toUpperCase() + todos[id].prio.slice(1);
  return /*html*/ `
      <div class="wrapper dialog-content slide-in" onclick="event.stopPropagation();">
        <div class="detail-task scrollbar">
            <div class="x-task-category-container d-flex-sb-c">
              <div class="task-category bg-${todos[id].task_category}">${todos[id].task_category}</div>
              <img class="x-mark" onclick="closeDialog()" src="/assets/icons/board/xmark.svg" alt="xmark">
            </div>
            <div class="title">${todos[id].title}</div>
            <div class="description">${todos[id].description}</div>
            <div class="detail-group">
              <strong>Due date:</strong>
              <input id="dateEdit" class="detail-due-edit" type="date" value="${dueDate}" lang="de-DE" disabled>
            </div>
            <div class="detail-group">
              <strong>Priority:</strong>
              <span class="padding-left-16px">${priority}</span>
              <img class="prio-img" src="/assets/icons/board/${todos[id].prio}.svg" alt="prio">
            </div>
            <div class="detail-group">
              <strong>Assigned To:</strong>
              <div class="members"> <!-- TODO --> TODO Kontaktlist<div id="assignedToArea${id}"></div></div>
            </div>
            <div class="detail-group">
              <strong>Subtasks:</strong>
              <div id="subtasksList" class="subtasks"></div>
            </div>
            <div class="configuration">
              <div onclick="deleteTask(${id})"><img src="/assets/icons/board/delete.svg" alt="delete">
                <span>Delete</span>
              </div>
              <div onclick="generateEditTemplate(${id})" class="separator ">
              <img src="/assets/icons/board/edit.svg" alt="edit">
              <span>Edit</span>
            </div>
        </div>
      </div>
      `;
}

/**
 * Generates the HTML template for editing a specific task.
 * @param {number} id - The ID of the task to edit.
 */
function generateEditTemplate(id) {
  const dueDate = todos[id].dueDate;
  document.getElementById('dialog').innerHTML = /*html */ `
      <div class="wrapper dialog-content" onclick="event.stopPropagation();">
        <div class="edit-template detail-task scrollbar" >
            <div class="x-task-category-container d-flex-sb-c">
              <div></div>
              <img class="x-mark" onclick="closeDialog()" src="/assets/icons/board/xmark.svg" alt="xmark">
            </div>
          <strong>Title</strong>
            <input id="titleEdit" class="title-edit" type="text" value="${todos[id].title}" placeholder="Enter a title">
          <strong>Description</strong>
            <textarea id="textareaEdit" class="textarea-edit" rows="4" cols="50" maxlength="300" placeholder="Enter a description">${todos[id].description}</textarea>
          <strong>Due date</strong>
            <input id="dateEdit" class="due-edit" type="date" onfocus="showPicker();" value="${dueDate}" lang="de-DE">
          <strong>Priority</strong>

          <strong id="assignedTo">Assigned to</strong>

          <div class="subtask-container">
            <strong>Subtasks</strong>
            <div>
              <div class="subtask-group">
                <input id="subtaskInput" class="subtask-input" oninput="onInputSubtask(${id})" type="text" placeholder="Add new subtask">
                <div id="subtaskIcons" class="subtask-icons">
                  <img onclick="focusInput()" class="add-subtask" src="/assets/icons/board/property-add.svg" alt="add">
                </div>
              </div>
            </div>
            <div id="subtaskAddedList" class="subtask-added-list"></div>
          </div>

          <div class="configuration">
            <button onclick="editTask(${id})" class="save-edit-btn btn-hover d-flex-c-c">
              <img src="/assets/icons/board/create_task_ok.svg" alt="create-btn">
              <img src="/assets/icons/board/check.svg" alt="check">
            </button>
          </div>
        </div>
      </div>
    `;
}

/**
 * Generates and displays the assigned members for a specific task.
 * @param {number} id - The ID of the task whose assigned members are to be displayed.
 */
function generateAssignedTo(id) {
  document.getElementById(`assignedToArea${id}`).innerHTML = '';
  for (let j = 0; j < todos[id].assignedTo.length; j++) {
    const member = todos[id].assignedTo[j];
    document.getElementById(`assignedToArea${id}`).innerHTML += `
        <div>${member}</div>
        `;
  }
}

/**
 * Generates the HTML template for adding a new task.
 * @param {string} category - The category of the new task.
 * @param {string} contentId - The ID of the content area where the task will be added.
 */
function generatePopUpAddTask(category, contentId) {
  document.getElementById('dialog').innerHTML = /*html*/ `
    <div class="pop-up-add-Task slide-in dialog-content" onclick="event.stopPropagation();">
      <div class="d-flex-sb-c">
        <h2>Add Task</h2>
        <img class="x-mark" onclick="closeDialog()" src="/assets/icons/board/xmark.svg" alt="xmark">
      </div>
      <!-- TODO -->TODO add_task html and css

      <button onclick="closeDialog()">Cancel</button>
      <button onclick="createTask('${category}', '${contentId}'); closeDialog();">Create Task</button>
    </div>
    `;
  openDialog();
}

/**
 * Generates the HTML template for a subtask.
 * @param {number} i - The index of the main task.
 * @param {number} j - The index of the subtask.
 * @param {string} checkboxImgUrl - The URL for the checkbox image.
 * @param {string[]} subtaskTexts - The array of subtask texts.
 * @returns {string} - The HTML string representing the subtask.
 */
function generateSubtaskList(i, j, checkboxImgUrl, subtaskTexts) {
  return /*html*/ `
      <label>
        <div onclick="toggleCheckbox(${i}, ${j})" class="subtask-list d-flex-fs-c bg-hover">
          <div id="checkboxImg${j}" class="checkbox-img" style="background-image: url('${checkboxImgUrl}');"></div>
          <p class="text-wrap "> ${subtaskTexts[j]}</p>
        </div>
      </label>`;
}

/**
 * Generates the HTML template for a subtask item.
 *
 * @param {number} id - The ID of the current todo item.
 * @param {number} i - The index of the subtask within the todo item.
 * @returns {string} The HTML string representing the subtask item, including an input field and action icons.
 */
function generateSubtaskAddedListTemplate(i) {
  let subtaskValueWithBullet = getSubtaskWithBullet(currentSubtasks[i].text);
  return /*html*/ `
  <div id="subtask-item${i}" class="subtask-group subtask-list-group" onclick="event.stopPropagation()">
    <input onclick="readonlyToggle(${i});" id="subtaskListInput${i}" readonly class="subtask-input" type="text" value="${subtaskValueWithBullet}">
    <div id="subtaskListIcons" class="subtask-list-icons">
      <div id="subtaskAddedListIcons${i}" class="d-flex-c-c">
        <img onclick="readonlyToggle(${i});" class="add-subtask" src="/assets/icons/board/edit.svg" alt="edit">
        <img onclick="removeAddedSubtask(${i})" class="mg-left add-subtask" src="/assets/icons/board/delete.svg" alt="delete">
      </div>
    </div>
  </div>
  `;
}

/**
 * Generates HTML template for a member's initials displayed inside a circle.
 *
 * @param {string} initialsName - The initials of the member to display inside the circle.
 * @returns {string} The HTML string for the member's initials circle.
 */
function memberHtmlTemplate(initialsName) {
  return /*html*/ `
    <div class="initial-board-wrapper">
      <div class="initial-board d-flex-c-c" style="background-color: ${selectedContacts[0].color};">${initialsName}</div>
    </div>
    `;
}
