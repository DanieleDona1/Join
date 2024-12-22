/**
 * Handles input events on the 'subtaskInput' field. Updates the subtask icons based on input content.
 * If the input field has content, displays icons for adding or clearing the subtask.
 * If the input field is empty, resets the field.
 *
 * @param {number} id - The unique identifier for the subtask being added or cleared.
 */
function onInputSubtask(inputId) {
  let subtaskInput = document.getElementById(inputId);
  if (subtaskInput.value !== '') {
    document.getElementById('subtaskIcons').innerHTML = /*html*/ `
    <div class="d-flex-c-c">
      <img onclick="focusInput(); resetInputField('${inputId}');" class="add-subtask" src="../assets/icons/board/property-close.svg" alt="close">
      <img class="mg-left" onclick="addCurrentSubtask('${inputId}');" class="add-subtask" src="../assets/icons/board/property-check.svg" alt="check">
    </div>
  `;
  } else {
    resetInputField(inputId);
  }
}

/**
 * Clears the 'subtaskInput' field and resets the 'subtaskIcons' area to show the default add icon.
 * Removes any additional icons previously added to 'subtaskIcons' when input is non-empty.
 */
function resetInputField(inputId) {
  document.getElementById(inputId).value = '';
  document.getElementById('subtaskIcons').innerHTML = /*html*/ `
    <img onclick="focusInput()" class="add-subtask" src="../assets/icons/board/property-add.svg" alt="add">`;
}

/**
 * Adds the current subtask input value to the `currentSubtasks` array with a bullet point.
 * Sets the subtask as unchecked by default, then renders the updated subtask list and resets the input field.
 */
function addCurrentSubtask(inputId) {
  let subtaskInput = document.getElementById(inputId);
  currentSubtasks.push({ checked: false, text: subtaskInput.value });

  renderSubtaskAddedList();
  resetInputField(inputId);
}

/**
 * Retrieves the current value of the 'subtaskInput' field and prepends a bullet point.
 *
 * @returns {string} - The input value prefixed with a bullet point.
 */
function getSubtaskWithBullet(subtaskInput) {
  let bulletPoint = '• ';
  if (subtaskInput.startsWith(bulletPoint)) {
    return subtaskInput;
  }
  if (subtaskInput.startsWith(bulletPoint)) {
    return subtaskInput;
  }
  return bulletPoint + subtaskInput;
}

/**
 * Renders the list of added subtasks by updating the 'subtaskAddedList' element.
 * Clears any existing content and populates it with the current subtasks from `currentSubtasks`.
 */
function renderSubtaskAddedList() {
  let subtaskAddedList = document.getElementById('subtaskAddedList');
  subtaskAddedList.innerHTML = '';

  for (let i = 0; i < currentSubtasks.length; i++) {
    subtaskAddedList.innerHTML += generateSubtaskAddedListTemplate(i);
  }
}

/**
 * Toggles the readonly state of a specified subtask input field, and updates its focus and icons based on the new state.
 * When the field is editable, it focuses the input, updates the icons, prevents accidental icon focus,
 * and adds an event listener to handle focus-out actions.
 *
 * @param {number} index - The index of the subtask, used to identify the correct input field and associated elements.
 */
function readonlyToggle(index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  const subtaskItem = document.getElementById(`subtask-item${index}`);

  toggleReadOnly(inputField);

  if (!inputField.readOnly) {
    focusInputField(inputField);
    updateIconsOnFocus(index);
    preventRemoveIconFocus(index);
    addFocusOutListener(inputField, subtaskItem, index);
  }
}

/**
 * Toggles the readonly property of the specified input field.
 * Sets the input field to readonly if it is currently editable, and vice versa.
 *
 * @param {HTMLInputElement} inputField - The input field element to toggle.
 */
function toggleReadOnly(inputField) {
  inputField.readOnly = !inputField.readOnly;
}

/**
 * Sets focus on the specified input field and moves the cursor to the end of the text.
 *
 * @param {HTMLInputElement} inputField - The input field element to focus and adjust the cursor position.
 */
function focusInputField(inputField) {
  inputField.focus();
  inputField.setSelectionRange(inputField.value.length, inputField.value.length);
}

/**
 * Updates the icons for a specific subtask to show delete and confirm icons when the subtask is focused.
 *
 * @param {number} index - The index of the subtask, used to locate and update the relevant icon container.
 */
function updateIconsOnFocus(index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  subtaskAddedListIcons.innerHTML = /*html*/ `
      <img id="removeIconOnFocus${index}" onclick="removeAddedSubtask(${index});" class="add-subtask" src="../assets/icons/board/property-delete.svg" alt="delete">
      <img class="mg-left" onclick="currentEditSubtask(${index})" class="add-subtask" src="../assets/icons/board/property-check.svg" alt="check">
    `;
}

/**
 * Prevents the focus on the remove icon when it is clicked, allowing for smoother interaction.
 *
 * @param {number} index - The index of the subtask, used to identify the specific remove icon element.
 */
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
function addFocusOutListener(inputField, subtaskItem, index) {
  const handleFocusOut = (event) => {
    if (shouldHandleFocusOut(event, subtaskItem)) {
      handleSubtaskEdit(index);
      updateIconsOffFocus(index);
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
function shouldHandleFocusOut(event, subtaskItem) {
  return !subtaskItem.contains(event.relatedTarget) && event.relatedTarget?.id !== 'removeIconOnFocus';
}

/**
 * Handles the editing of a subtask at the specified index.
 * If a subtask exists at the given index in the currentSubtasks array,
 * it invokes the currentEditSubtask function for that subtask.
 *
 * @param {number} index - The index of the subtask to be edited.
 */
function handleSubtaskEdit(index) {
  if (currentSubtasks[index]) {
    currentEditSubtask(index);
  }
}

/**
 * Updates the icons displayed for a specific subtask when it loses focus.
 * Replaces the current icons with edit and delete icons, allowing further actions on the subtask.
 *
 * @param {number} index - The index of the subtask for which the icons are being updated.
 */
function updateIconsOffFocus(index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  if (subtaskAddedListIcons) {
    subtaskAddedListIcons.innerHTML = /*html*/ `
      <img onclick="readonlyToggle(${index});" class="add-subtask" src="../assets/icons/board/edit.svg" alt="edit">
      <img class="mg-left" onclick="removeAddedSubtask(${index})" class="add-subtask" src="../assets/icons/board/delete.svg" alt="delete">
      `;
  }
}

/**
 * Updates the text of the currently edited subtask at the specified index
 * with the value from the corresponding input field.
 *
 * @param {number} index - The index of the subtask being edited.
 */
function currentEditSubtask(index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  currentSubtasks[index].text = inputField.value;
}

/**
 * Saves the current list of subtasks to the specified task in storage,
 * only if there are subtasks present in the currentSubtasks array.
 *
 * @param {number} id - The index of the task in the todoKeysArray to which the subtasks are being saved.
 */
function saveCurrentSubtask(i) {
  if (currentSubtasks.length > 0) {
    if (!currentTodos[i]['subtask']) {
      currentTodos[i]['subtask'] = [...currentSubtasks];
    } else {
      currentTodos[i]['subtask'] = [...currentTodos[i]['subtask'], ...currentSubtasks];
    }
    editTaskRemote(todoKeysArray[i], { subtask: currentTodos[i]['subtask'] });
  }
}

/**
 * Removes a subtask from the currentSubtasks array at the specified index
 * and re-renders the updated list of subtasks.
 *
 * @param {number} index - The index of the subtask to be removed.
 */
function removeAddedSubtask(index) {
  if (index === 'all') {
    currentSubtasks = [];
  } else {
    currentSubtasks.splice(index, 1);
  }
  renderSubtaskAddedList();
}
