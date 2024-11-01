

function formatDate(input) {
  let value = cleanInput(input.value);
  let { day, month, year } = extractDateParts(value);
  ({ day, month } = validateDate(day, month));
  input.value = formatOutput(day, month, year);
}

function cleanInput(value) {
  // Entferne alle Nicht-Zahlen
  return value.replace(/\D/g, "");
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
  day = day > 31 ? "31" : day;
  month = month > 12 ? "12" : month;
  return { day, month };
}

function formatOutput(day, month, year) {
  // Setze den formatierten Wert zusammen
  let output = day;
  if (month) output += "/" + month;
  if (year) output += "/" + year;
  return output;
}

document.addEventListener('DOMContentLoaded', function () {
  // Hole alle Dropdowns
  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach(customSelect => {
      const selected = customSelect.querySelector('.select-selected');
      const optionsContainer = customSelect.querySelector('.select-items');

      // Toggle das Dropdown beim Klicken auf die ausgewählte Option
      selected.addEventListener('click', function () {
          optionsContainer.classList.toggle('select-hide');
          customSelect.classList.toggle('open'); // Klasse für die Öffnung hinzufügen
      });

      const options = optionsContainer.querySelectorAll('.select-option');
      options.forEach(option => {
          option.addEventListener('click', function () {
              selected.textContent = this.textContent; // Auswahl aktualisieren
              optionsContainer.classList.add('select-hide'); // Dropdown schließen
              customSelect.classList.remove('open'); // Klasse entfernen, wenn geschlossen
          });
      });
  });

  // Schließe das Dropdown, wenn außerhalb geklickt wird
  document.addEventListener('click', function (e) {
      customSelects.forEach(customSelect => {
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
        <img class="mg-left" onclick="saveCurrentSubtask()" class="add-subtask" src="/assets/icons/board/property-check.svg" alt="check">
      </div>
    `;
    } else {
      resetInputField()
    }
  }
