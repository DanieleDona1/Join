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
      <div class="detail-task slide-in dialog-content" onclick="event.stopPropagation();">
          <div class="d-flex-sb-c">
            <span class="task-category bg-${taskCategory}">${todos[id].task_category}</span>
              <img class="xmark" onclick="closeDialog()" src="/assets/icons/board/xmark.svg" alt="xmark">
          </div>
          <div class="title">${todos[id].title}</div>
          <div class="description">${todos[id].description}</div>
          <div class="due-date color-blue">Due date:&nbsp; <span class="color-black">${formattedDate}</span></div><!-- Input type=date dieses Attribut hinzufügen: lang="de-DE" -->
          <div>
            <span class="color-blue">Priority:&nbsp; <span class="color-black">${priority}</span></span>
            <img class="prio-img" src="/assets/icons/board/${todos[id].prio}.svg" alt="prio">
          </div>

          <div class="d-flex-sb-c">
            <div class="members color-blue">Assigned To: <!-- TODO --> TODO Kontaktlist<div id="assignedToArea${id}"></div></div>
          </div>
          <div id="subtasksList" class="subtasks color-blue">Subtasks:<div></div></div>
          <div class="configuration">
            <div onclick="deleteTask(${id})"><img src="/assets/icons/board/delete.svg" alt="delete"><span class="color-blue">Delete</span></div>
            <div onclick="generateEditTemplate(${id})" class="separator ">
            <img src="/assets/icons/board/edit.svg" alt="edit">
            <span class="color-blue">Edit</span>
          </div>
      </div>`;
}

/**
 * Generates the HTML template for editing a specific task.
 * @param {number} id - The ID of the task to edit.
 */
function generateEditTemplate(id) {
  const dueDate = todos[id].dueDate;
  document.getElementById('dialog').innerHTML = /*html */ `
      <div class="edit-template detail-task dialog-content" onclick="event.stopPropagation();">
        <div class="d-flex-e-c"><img class="xmark" onclick="closeDialog()" src="/assets/icons/board/xmark.svg" alt="xmark"></div>
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


        <div>Assigned to</div>

        <div class="subtask-container">
          <div onclick="">Subtasks</div>
          <div>
            <div class="subtask-group">
              <input id="subtaskInput" class="subtask-input" oninput="onInputSubtask(${id})" type="text" placeholder="Add new subtask">
              <div id="subtaskIcons" class="subtask-icons">
                <img onclick="focusInput()" class="add-subtask" src="/assets/icons/board/property-add.svg" alt="add">
              </div>
              <!-- <div id="newSubtaskAdded" class="new-subtask-added"></div> -->
            </div>
          </div>
          <ul id="subtaskAddedList" class="subtask-added-list"></ul>

          <button onclick="createEditTask(${id})" class="save-edit-btn btn-hover d-flex-c-c configuration">
            <img src="/assets/icons/board/create_task_ok.svg" alt="create-btn">
            <img src="/assets/icons/board/check.svg" alt="check">
          </button>
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
        <img class="xmark" onclick="closeDialog()" src="/assets/icons/board/xmark.svg" alt="xmark">
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
      <div>
        <label onclick="toggleCheckboxUrl(${i}, ${j})" class="subtask-list d-flex-fs-c">
          <div id="checkboxImg${j}" class="checkbox-img" style="background-image: url('${checkboxImgUrl}');"></div>
          <span> ${subtaskTexts[j]}</span>
        </label>
      </div>`;
}
