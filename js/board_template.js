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
            <div class="members"><!-- TODO -->TODO Members</div>
            <img draggable="false" src="/assets/icons/board/${task.prio}.svg" alt="prio">
          </div>
      </div>`;
}

/**
 * Generates the detailed HTML template for a specific task.
 * @param {number} id - The ID of the task to display details for.
 * @returns {string} - The HTML string for the detailed task view.
 */
function generateDetailTaskTemplate(id) {
  let taskCategory = todos[id].task_category.replace(/\s+/g, '-').toLowerCase();
  let formattedDate = todos[id].dueDate.replace(/-/g, '/');
  let priority = todos[id].prio.charAt(0).toUpperCase() + todos[id].prio.slice(1);
  return /*html*/ `
      <div class="wrapper dialog-content slide-in" onclick="event.stopPropagation();">
        <div class="detail-task scrollbar">
                <div class="x-container">
                  <img class="x-mark" onclick="closeDialog()" src="/assets/icons/board/xmark.svg" alt="xmark">
                </div>
            <!-- </div> -->
            <div class="title">${todos[id].title}</div>
            <div class="description">${todos[id].description}</div>
            <h3 class="color-blue">Due date:</h3>
            <span class="color-black">${formattedDate}</span><!-- Input type=date dieses Attribut hinzufügen: lang="de-DE" -->
            <div>
              <h3 class="color-blue">Priority</h3>
              <span class="color-black">${priority}</span>
              <img class="prio-img" src="/assets/icons/board/${todos[id].prio}.svg" alt="prio">
            </div>
            <div class="d-flex-co-sb-c">
              <h3 class="color-blue">Assigned To:</h3>
              <div class="members color-blue"> <!-- TODO --> TODO Kontaktlist<div id="assignedToArea${id}"></div></div>
            </div>
            <div>
              <h3 class="color-blue">Subtasks:</h3>
              <div id="subtasksList" class="subtasks color-blue"></div>
            </div>
            <div class="configuration">
              <div onclick="deleteTask(${id})"><img src="/assets/icons/board/delete.svg" alt="delete">
                <span class="color-blue">Delete</span>
              </div>
              <div onclick="generateEditTemplate(${id})" class="separator ">
              <img src="/assets/icons/board/edit.svg" alt="edit">
              <span class="color-blue">Edit</span>
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
            <div class="x-container">
              <img class="x-mark" onclick="closeDialog()" src="/assets/icons/board/xmark.svg" alt="xmark">
            </div>
          <label>Title<br>
            <input class="title-edit" id="titleEdit" type="text" value="${todos[id].title}" placeholder="Enter a title">
          </label>
          <label>Description
            <textarea class="textarea-edit" rows="4" cols="50" maxlength="300" placeholder="Enter a description">${todos[id].description}</textarea>
          </label>
          <label>Due date<br> <input class="due-edit" id="dueEdit" type="date" onfocus="showPicker();" value="${dueDate}" lang="de-DE"></label>
          <div>
            <div>Priority</div>
          </div>
          <div id="assignedTo">Assigned to</div>
          <div class="subtask-container">
            <div>Subtasks</div>
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
            <button onclick="createEditTask(${id})" class="save-edit-btn btn-hover d-flex-c-c">
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
  return /*html*/ `
  <div id="subtask-item${i}" class="subtask-group subtask-list-group" onclick="event.stopPropagation()">
    <input onclick="readonlyToggle(${i});" id="subtaskListInput${i}" readonly class="subtask-input" type="text" value="${currentSubtasks[i].text}">
    <div id="subtaskListIcons" class="subtask-list-icons">
      <div id="subtaskAddedListIcons${i}" class="d-flex-c-c">
        <img onclick="readonlyToggle(${i});" class="add-subtask" src="/assets/icons/board/edit.svg" alt="edit">
        <img onclick="removeAddedSubtask(${i})" class="mg-left add-subtask" src="/assets/icons/board/delete.svg" alt="delete">
      </div>
    </div>
  </div>
  `;
}
