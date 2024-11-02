function formatDate(input) {
  let value = cleanInput(input.value);
  let { day, month, year } = extractDateParts(value);
  ({ day, month } = validateDate(day, month));
  input.value = formatOutput(day, month, year);
}

function cleanInput(value) {
  // Entferne alle Nicht-Zahlen
  return value.replace(/\D/g, '');
}

function extractDateParts(value) {
  // Teile den Wert in Tag, Monat und Jahr auf
  return {
    day: value.substring(0, 2),
    month: value.substring(2, 4),
    year: value.substring(4, 8),
  };
}

function validateDate(day, month) {
  // Überprüfe und begrenze Tag und Monat
  day = day > 31 ? '31' : day;
  month = month > 12 ? '12' : month;
  return { day, month };
}

function formatOutput(day, month, year) {
  // Setze den formatierten Wert zusammen
  let output = day;
  if (month) output += '/' + month;
  if (year) output += '/' + year;
  return output;
}

document.addEventListener('DOMContentLoaded', function () {
  // Hole alle Dropdowns
  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach((customSelect) => {
    const selected = customSelect.querySelector('.select-selected');
    const optionsContainer = customSelect.querySelector('.select-items');

    // Toggle das Dropdown beim Klicken auf die ausgewählte Option
    selected.addEventListener('click', function () {
      optionsContainer.classList.toggle('select-hide');
      customSelect.classList.toggle('open'); // Klasse für die Öffnung hinzufügen
    });

    const options = optionsContainer.querySelectorAll('.select-option');
    options.forEach((option) => {
      option.addEventListener('click', function () {
        selected.textContent = this.textContent; // Auswahl aktualisieren
        optionsContainer.classList.add('select-hide'); // Dropdown schließen
        customSelect.classList.remove('open'); // Klasse entfernen, wenn geschlossen
      });
    });
  });

  // Schließe das Dropdown, wenn außerhalb geklickt wird
  document.addEventListener('click', function (e) {
    customSelects.forEach((customSelect) => {
      const selected = customSelect.querySelector('.select-selected');
      const optionsContainer = customSelect.querySelector('.select-items');

      if (!selected.contains(e.target) && !optionsContainer.contains(e.target)) {
        optionsContainer.classList.add('select-hide');
        customSelect.classList.remove('open'); // Klasse entfernen, wenn geschlossen
      }
    });
  });
});

// _______________________Subtask Javascript Code_______________________________
let currentSubtasks = [];

/**
 * Updates the subtask icons based on the input state.
 *
 * @param {number} id - The ID of the current todo item.
 */
function onInputSubtaskAddTask() {
  let subtaskInput = document.getElementById('subtaskInput');
  if (subtaskInput.value !== '') {
    document.getElementById('subtaskIcons').innerHTML = /*html*/ `
      <div class="d-flex-c-c">
        <img onclick="focusInput(); resetInputField();" class="add-subtask" src="/assets/icons/board/property-close.svg" alt="close">
        <img class="mg-left" onclick="addCurrentSubtask()" class="add-subtask" src="/assets/icons/board/property-check.svg" alt="check">
      </div>
    `;
  } else {
    resetInputField();
  }
}

function addCurrentSubtask() { //so ähnlich wie saveCurrentSubtask
  let subtaskValueWithBullet = getSubtaskWithBullet();
  currentSubtasks.push({ checked: false, text: subtaskValueWithBullet });
  console.log('currentSubtasks:', currentSubtasks);

  renderSubtaskAddedListAddTask();
  resetInputField();
}

function renderSubtaskAddedListAddTask() {
  let subtaskAddedList = document.getElementById('subtaskAddedList');
  subtaskAddedList.innerHTML = '';

  for (let i = 0; i < currentSubtasks.length; i++) {
    subtaskAddedList.innerHTML += generateSubtaskListAddTaskTemplate(i);
  }
}

function generateSubtaskListAddTaskTemplate(i) {
  return /*html*/ `
  <div id="subtask-item${i}" class="subtask-group subtask-list-group" onclick="event.stopPropagation()">
    <input onclick="readonlyToggleAddTask(${i});" id="subtaskListInput${i}" readonly class="subtask-input" type="text" value="${currentSubtasks[i].text}">
    <div id="subtaskListIcons" class="subtask-list-icons">
      <div id="subtaskAddedListIcons${i}" class="d-flex-c-c">
        <img onclick="readonlyToggleAddTask(${i});" class="add-subtask" src="/assets/icons/board/edit.svg" alt="edit">
        <img onclick="removeAddedSubtaskAddTask(${i})" class="mg-left add-subtask" src="/assets/icons/board/delete.svg" alt="delete">
      </div>
    </div>
  </div>
  `;
}

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

function updateIconsOnFocusAddTask(index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  subtaskAddedListIcons.innerHTML = /*html*/ `
      <img id="removeIconOnFocus${index}" onclick="removeAddedSubtaskAddTask(${index});" class="add-subtask" src="/assets/icons/board/property-delete.svg" alt="delete">
      <img class="mg-left" onclick="currentEditSubtaskAddTask(${index})" class="add-subtask" src="/assets/icons/board/property-check.svg" alt="check">
    `;
}

function addFocusOutListenerAddTask(inputField, subtaskItem, index) {
  const handleFocusOut = (event) => {
    if (shouldHandleFocusOut(event, subtaskItem)) {
      handleSubtaskEditAddTask(index);
      updateIconsOffFocusAddTask(index);
      inputField.readOnly = true;
      document.removeEventListener('focusout', handleFocusOut);
    }
  };
  inputField.addEventListener('focusout', handleFocusOut);
}

function handleSubtaskEditAddTask(index) {
  if (currentSubtasks[index]) {
    currentEditSubtaskAddTask(index);
  }
}

function currentEditSubtaskAddTask(index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  currentSubtasks[index].text = inputField.value;
}

function updateIconsOnFocusAddTask(index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  subtaskAddedListIcons.innerHTML = /*html*/ `
      <img id="removeIconOnFocus${index}" onclick="removeAddedSubtaskAddTask(${index});" class="add-subtask" src="/assets/icons/board/property-delete.svg" alt="delete">
      <img class="mg-left" onclick="currentEditSubtaskAddTask(${index})" class="add-subtask" src="/assets/icons/board/property-check.svg" alt="check">
    `;
}

function updateIconsOffFocusAddTask(index) {
  const subtaskAddedListIcons = document.getElementById('subtaskAddedListIcons' + index);
  if (subtaskAddedListIcons) {

    subtaskAddedListIcons.innerHTML = /*html*/ `
      <img onclick="readonlyToggleAddTask(${index});" class="add-subtask" src="/assets/icons/board/edit.svg" alt="edit">
      <img class="mg-left" onclick="removeAddedSubtaskAddTask(${index})" class="add-subtask" src="/assets/icons/board/delete.svg" alt="delete">
      `;
    }
}

function removeAddedSubtaskAddTask(index) {
  currentSubtasks.splice(index, 1);
  renderSubtaskAddedListAddTask();
}

function currentEditSubtaskAddTask(index) {
  const inputField = document.getElementById(`subtaskListInput${index}`);
  currentSubtasks[index].text = inputField.value;
}
