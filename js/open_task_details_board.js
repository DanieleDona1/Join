/**
 * Opens a dialog to display task details.
 * @param {number} id - The ID of the task to display.
 */
function openTaskDetails(id) {
  loadCurrentPriority(id);
  document.getElementById('dialog').innerHTML = generateDetailTaskTemplate(id);
  loadSubtaskList(id);
  loadAssignedToList(id);
  openDialog();
}

/**
 * Loads the priority of the current todo item and sets it as the active priority.
 * @param {number} i - The index of the todo item in the currentTodos array.
 */
function loadCurrentPriority(i) {
  let currentPrio = currentTodos[i].prio;
  activePriority = currentPrio;
}

/**
 * Loads the subtasks for a given task and updates the display.
 * @param {number} i - The index of the task in the currentTodos array.
 */
function loadSubtaskList(i) {
  if (currentTodos[i].subtask) {
    let subtasksList = document.getElementById('subtasksList');
    let checkboxImgUrl;
    let subtaskStatus = currentTodos[i].subtask.map((sub) => sub.checked);
    let subtaskTexts = currentTodos[i].subtask.map((sub) => sub.text);

    for (let j = 0; j < subtaskTexts.length; j++) {
      if (subtaskStatus[j]) {
        checkboxImgUrl = '../assets/icons/board/checkbox-checked.svg';
      } else {
        checkboxImgUrl = '../assets/icons/board/checkbox-unchecked.svg';
      }
      subtasksList.innerHTML += generateSubtaskList(i, j, checkboxImgUrl, subtaskTexts);
    }
  }
}

/**
 * Loads and displays the list of members assigned to a specific task.
 *
 * @param {number} i - The index of the task in the `currentTodos` array.
 * Updates the `membersDetailTask` container with member initials and names for each contact in the `assignedTo` list.
 */
function loadAssignedToList(i) {
  if (currentTodos[i].assignedTo) {
    const selectedContactsKeys = currentTodos[i].assignedTo.map((t) => t);
    let membersContainer = document.getElementById('membersDetailTask');
    membersContainer.innerHTML = '';

    for (let j = 0; j < selectedContactsKeys.length; j++) {
      selectedContacts = contactList.filter((f) => f.id === selectedContactsKeys[j]);
      const name = selectedContacts[0].firstName + ' ' + selectedContacts[0].lastName;
      const initialsName = generateInitials(name);

      if (initialsName) {
        membersContainer.innerHTML += memberDetailTaskTemplate(initialsName, name);
      }
    }
  }
}
