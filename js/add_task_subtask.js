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
          onclick="event.stopPropagation(); addCurrentSubtaskAddTask('${inputId}');"
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
 * Adds a subtask to the current task and updates the list.
 *
 * @param {string} inputId - The ID of the input field for the subtask.
 * @returns {void}
 */
function addCurrentSubtaskAddTask(inputId) {
  currentTaskId = 0;
  let subtaskInput = document.getElementById(inputId);

  if (!currentSubtasks[currentTaskId].subtask) {
    currentSubtasks[currentTaskId].subtask = [];  // Initialisiere das Subtask-Array, falls nicht vorhanden
  }
  currentSubtasks[currentTaskId].subtask.push({ checked: false, text: subtaskInput.value });
  console.log('ADDED:', currentSubtasks);


  renderSubtaskAddedListAddTask();
  resetInputField(inputId);
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
 * Clears the 'subtaskInput' field and resets the 'subtaskIcons' area to show the default add icon.
 * Removes any additional icons previously added to 'subtaskIcons' when input is non-empty.
 */
// TODO
function resetInputField(inputId) {
  document.getElementById(inputId).value = '';
  document.getElementById('subtaskIcons').innerHTML = /*html*/ `
    <img onclick="focusInput()" class="add-subtask" src="../assets/icons/board/property-add.svg" alt="add">`;
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
 * Toggles the readonly property of the specified input field.
 * Sets the input field to readonly if it is currently editable, and vice versa.
 *
 * @param {HTMLInputElement} inputField - The input field element to toggle.
 */
// TODO
function toggleReadOnly(inputField) {
  inputField.readOnly = !inputField.readOnly;
}

/**
 * Sets focus on the specified input field and moves the cursor to the end of the text.
 *
 * @param {HTMLInputElement} inputField - The input field element to focus and adjust the cursor position.
 */
// TODO
function focusInputField(inputField) {
  inputField.focus();
  inputField.setSelectionRange(inputField.value.length, inputField.value.length);
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
 * Prevents the focus on the remove icon when it is clicked, allowing for smoother interaction.
 *
 * @param {number} index - The index of the subtask, used to identify the specific remove icon element.
 */
// TODO
function preventRemoveIconFocus(index) {
  const removeIconOnFocus = document.getElementById(`removeIconOnFocus${index}`);
  if (removeIconOnFocus) {
    removeIconOnFocus.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
  }
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
 * Determines whether the focusout event should be handled based on the related target
 * and the specific subtask item.
 *
 * @param {FocusEvent} event - The focusout event to evaluate.
 * @param {HTMLElement} subtaskItem - The subtask item element that is being checked against.
 * @returns {boolean} - Returns true if the focusout should be handled; otherwise, false.
 */
// TODO
function shouldHandleFocusOut(event, subtaskItem) {
  return !subtaskItem.contains(event.relatedTarget) && event.relatedTarget?.id !== 'removeIconOnFocus';
}

/**
 * Handles the editing of a subtask. Updates the subtask text if the input is not empty,
 * otherwise highlights the input field with a red border and restores the previous value.
 *
 * @param {number} index - The index of the subtask to be edited.
 * @returns {void}
 */
// TODO
function handleSubtaskEdit(index) {
  setTimeout(() => {
    const inputField = document.getElementById(`subtaskListInput${index}`);
    const bulletInputContainer = document.getElementById(`bulletInputContainer${index}`);

    if (inputField) {
      if (inputField.value.trim()) {
        if (currentSubtasks[currentTaskId]) {
          console.log('index:', index);
          currentSubtasks[currentTaskId].subtask[index].text = inputField.value;
        } else {
          currentTodos[currentTaskId].subtask[index].text = inputField.value;
        }
      } else {
        bulletInputContainer.style.border = '1px solid red';
      }
    }
  }, 50);
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
 * Resets the border of the element with the given ID if its border is currently '1px solid red'.
 *
 * @param {string} elementId - The ID of the element to reset the border for.
 * @returns {void}
 */
// TODO
function resetBorder(elementId) {
  const bulletInputContainer = document.getElementById(`bulletInputContainer${elementId}`);
  if (bulletInputContainer.style.border === '1px solid red') {
    bulletInputContainer.style.border = 'none';
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
    console.log('in');
    currentSubtasks = [{subtask: [],},];
  } else {
    currentSubtasks[0].subtask.splice(index, 1);
  }
  console.log('currentSubtasks[0].subtask', currentSubtasks[0].subtask);
  renderSubtaskAddedListAddTask();
}
