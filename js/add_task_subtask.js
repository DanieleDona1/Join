/**
 * Updates the UI with icons for adding or resetting a subtask based on the input field's value.
 *
 * @param {string} inputId - The ID of the input element.
 * If the input is not empty, displays icons for confirming or resetting the subtask.
 * If the input is empty, resets the field.
 */
function onInputSubtaskAddTask(inputId) {
  let subtaskInput = document.getElementById(inputId);
  if (subtaskInput.value !== '') {
    document.getElementById('subtaskIcons').innerHTML = /*html*/ `
      <div class="d-flex-c-c">
        <img
          onclick="event.stopPropagation(); focusInput(); resetInputField('${inputId}');"
          class="add-subtask"
          src="../assets/icons/board/property-close.svg"
          alt="close">
        <img
          onclick="event.stopPropagation(); addCurrentSubtask('${inputId}');"
          class="mg-left add-subtask"
          src="../assets/icons/board/property-check.svg"
          alt="check">
      </div>
    `;
  } else {
    resetInputField(inputId);
  }
}

/**
 * Renders the list of added subtasks for the current task.
 * Clears the existing list and generates new list items based on `currentSubtasks`.
 *
 * @description
 * Iterates over the `subtask` array of the current task and appends a generated template
 * for each subtask to the `subtaskAddedList` element.
 */
function renderSubtaskAddedListAddTask() {
  let subtaskAddedList = document.getElementById('subtaskAddedList');
  subtaskAddedList.innerHTML = '';
  if (currentSubtasks) {
    for (let i = 0; i < currentSubtasks[currentTaskId].subtask.length; i++) {
      subtaskAddedList.innerHTML += generateSubtaskListTemplateAddTask(i, currentSubtasks[currentTaskId].subtask);
    }
  }
}

/**
 * Toggles the readonly state of a specified subtask input field, and updates its focus and icons based on the new state.
 * When the field is editable, it focuses the input, updates the icons, prevents accidental icon focus,
 * and adds an event listener to handle focus-out actions.
 *
 * @param {number} index - The index of the subtask, used to identify the correct input field and associated elements.
 */
function readonlyToggleAddTask(index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  const subtaskItem = document.getElementById(`subtask-item${index}`);

  toggleReadOnly(inputField);

  if (!inputField.readOnly) {
    focusInputField(inputField);
    updateIconsOnFocusAddTask(index);
    preventRemoveIconFocus(index);
    addFocusOutListenerAddTask(inputField, subtaskItem, index);
  }
}

/**
 * Updates the icons for a specific subtask to show delete and confirm icons when the subtask is focused.
 *
 * @param {number} index - The index of the subtask, used to locate and update the relevant icon container.
 */
function updateIconsOnFocusAddTask(index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  subtaskAddedListIcons.innerHTML = /*html*/ `
      <img id="removeIconOnFocus${index}" onclick="removeAddedSubtaskAddTask(${index}); event.stopPropagation();" class="add-subtask" src="../assets/icons/board/property-delete.svg" alt="delete">
      <img class="mg-left" onclick="currentEditSubtask(${index})" class="add-subtask" src="../assets/icons/board/property-check.svg" alt="check">
    `;
}

/**
 * Adds a focusout event listener to the specified input field that handles the logic for
 * editing the subtask when the input field loses focus.
 *
 * @param {HTMLInputElement} inputField - The input field element to which the focusout listener is added.
 * @param {HTMLElement} subtaskItem - The subtask item element associated with the input field, used for validation.
 * @param {number} index - The index of the subtask, used to identify which subtask is being edited.
 */
function addFocusOutListenerAddTask(inputField, subtaskItem, index) {
  const handleFocusOut = (event) => {
    if (shouldHandleFocusOut(event, subtaskItem)) {
      handleSubtaskEdit(index);
      updateIconsOffFocusAddTask(index);
      inputField.readOnly = true;
      document.removeEventListener('focusout', handleFocusOut);
    }
  };
  inputField.addEventListener('focusout', handleFocusOut);
}

/**
 * Updates the icons displayed for a specific subtask when it loses focus.
 * Replaces the current icons with edit and delete icons, allowing further actions on the subtask.
 *
 * @param {number} index - The index of the subtask for which the icons are being updated.
 */
function updateIconsOffFocusAddTask(index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  if (subtaskAddedListIcons) {
    subtaskAddedListIcons.innerHTML = /*html*/ `
      <img onclick="readonlyToggleAddTask(${index});" class="add-subtask" src="../assets/icons/board/edit.svg" alt="edit">
      <img class="mg-left" onclick="removeAddedSubtaskAddTask(${index})" class="add-subtask" src="../assets/icons/board/delete.svg" alt="delete">
      `;
  }
}

/**
 * Removes a subtask from the currentSubtasks array at the specified index
 * and re-renders the updated list of subtasks.
 *
 * @param {number} index - The index of the subtask to be removed.
 */
function removeAddedSubtaskAddTask(index) {
  if (index === 'all') {
    currentSubtasks = [{ subtask: [] }];
  } else {
    currentSubtasks[0].subtask.splice(index, 1);
  }
  renderSubtaskAddedListAddTask();
}
