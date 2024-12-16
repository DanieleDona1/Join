function generateHtmlTemplate(i, task, element) {
    return /*html*/ `
      <div class="task" draggable="true" onclick="openTaskDetails(${element['id']})" ondragstart="startDragging(${element['id']})">
          <div class="task-category bg-${task[i].task_category
            .replace(/\s+/g, "-")
            .toLowerCase()}">${task[i].task_category}</div>
          <div class="title">${task[i].title}</div>
          <div class="description">${task[i].description}</div>
          <div class="subtasks"><!-- TODO -->TODO Subtask</div>
          <div class="d-flex-sb-c">
            <div class="members"><!-- TODO -->TODO Members</div>
            <img draggable="false" src="../assets/icons/board/${task[i].prio}.svg" alt="prio">
          </div>
      </div>`;
  }

  function generateDetailTaskTemplate(id) {
    let taskCategory = todos[id].task_category.replace(/\s+/g, "-").toLowerCase();
    let formattedDate = todos[id].dueDate.replace(/-/g, '/');
    let priority = todos[id].prio.charAt(0).toUpperCase() + todos[id].prio.slice(1);
    return /*html*/ `
      <div class="detail-task slide-in dialog-content" onclick="event.stopPropagation();">
          <div class="d-flex-sb-c">
            <span class="task-category bg-${taskCategory}">${todos[id].task_category}</span>
              <img class="xmark" onclick="closeDialog()" src="../assets/icons/board/xmark.svg" alt="xmark">
          </div>
          <div class="title">${todos[id].title}</div>
          <div class="description">${todos[id].description}</div>
          <div class="due-date color-blue">Due date:&nbsp; <span class="color-black">${formattedDate}</span></div><!-- Input type=date dieses Attribut hinzufügen: lang="de-DE" -->
          <div>
            <span class="color-blue">Priority:&nbsp; <span class="color-black">${priority}</span></span>
            <img class="prio-img" src="../assets/icons/board/${todos[id].prio}.svg" alt="prio">
          </div>

          <div class="d-flex-sb-c">
            <div class="members color-blue">Assigned To: <!-- TODO --> TODO Kontaktlist<div id="assignedToArea${id}"></div></div>
          </div>
          <div class="subtasks color-blue">Subtasks <div><!-- TODO --> TODO Subtask</div></div>
          <div class="configuration">
            <div onclick="deleteTask(${id})"><img src="../assets/icons/board/delete.svg" alt="delete"><span class="color-blue">Delete</span></div>
            <div onclick="generateEditTemplate(${id})" class="separator "><img src="../assets/icons/board/edit.svg" alt="edit"><span class="color-blue">Edit</span></div>
      </div>`;
  }

  function generateAssignedTo(id) {
    document.getElementById(`assignedToArea${id}`).innerHTML = "";
  for (let j = 0; j < todos[id].assignedTo.length; j++) {
    const member = todos[id].assignedTo[j];
    document.getElementById(`assignedToArea${id}`).innerHTML += `
        <div>${member}</div>
        `;
  }
}


  function generatePopUpAddTask(category, contentId) {
    document.getElementById('dialog').innerHTML = /*html*/`
    <div class="pop-up-add-Task slide-in dialog-content" onclick="event.stopPropagation();">
      <div class="d-flex-sb-c">
        <h2>Add Task</h2>
        <img class="xmark" onclick="closeDialog()" src="../assets/icons/board/xmark.svg" alt="xmark">
      </div>
      <!-- TODO -->TODO add_task html and css

      <button onclick="closeDialog()">Cancel</button>
      <button onclick="createTask('${category}', '${contentId}'); closeDialog();">Create Task</button>
    </div>
      <!-- Funktion createTask bearbeiten  -->

    `;
    openDialog();
  }

  function generateEditTemplate(id) {
    const dueDate = todos[id].dueDate;
    document.getElementById('dialog').innerHTML = /*html */`
      <div class="edit-template detail-task dialog-content" onclick="event.stopPropagation();">
        <div class="d-flex-e-c"><img class="xmark" onclick="closeDialog()" src="../assets/icons/board/xmark.svg" alt="xmark"></div>
        <label>Title:<br> <input class="title-edit" id="titleEdit" type="text" value="${todos[id].title}" placeholder="Enter a title"></label>
        <label>Description:<textarea class="textarea-edit" rows="4" cols="50" maxlength="200" placeholder="Enter a description">${todos[id].description}</textarea></label>
        <label>Due date:<br> <input class="due-edit" id="dueEdit" type="date" onfocus="showPicker();"></label>

        <button onclick="createEditTask(${id})" class="save-edit-btn btn-hover d-flex-c-c configuration">
          <img src="../assets/icons/board/create_task_ok.svg" alt="create-btn">
          <img src="../assets/icons/board/check.svg" alt="check">
        </button>

        <span>Edit id :  ${id}</span>

      </div>
    `;
  }
