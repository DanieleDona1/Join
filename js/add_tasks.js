async function onloadAddtasks() {
  await isUserLoggedIn();
  await generateHeaderInitials();
}

const contacts = [
  { firstName: 'Sofia', lastName: 'Müller', color: 'red' },
  { firstName: 'Anton', lastName: 'Mayer', color: 'blue' },
  { firstName: 'Anja', lastName: 'Schulz', color: 'green' },
  { firstName: 'Benedikt', lastName: 'Ziegler', color: 'purple' },
  { firstName: 'David', lastName: 'Eisenberg', color: 'orange' },
  { firstName: 'Max', lastName: 'Mustermann', color: 'brown' },
];

const selectedInitials = [];
const activePriority = 'medium'; //TODO kannst du der activePriority Variable, die ausgesuchte Priorität zuweisen, wenn auf die buttons geklickt wird urgent, medium und low, Standardmäßig ist medium zugewiesen.

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
  let output = day;
  if (month) output += "/" + month;
  if (year) output += "/" + year;
  return output;
}

document.addEventListener('DOMContentLoaded', function () {
  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach((customSelect) => {
    const selected = customSelect.querySelector('.select-selected');
    const optionsContainer = customSelect.querySelector('.select-items');
    const selectId = customSelect.getAttribute('id');

    // Toggle das Dropdown beim Klicken auf die ausgewählte Option
    selected.addEventListener('click', function () {
      optionsContainer.classList.toggle('select-hide');
      customSelect.classList.toggle('open'); // Klasse für die Öffnung hinzufügen
    });

    const options = optionsContainer.querySelectorAll('.select-option');
    options.forEach((option) => {
      option.addEventListener('click', function () {
        // Überprüfe, ob es sich um dropdown1 handelt
        if (selectId === 'drop-down-2') {
          selected.textContent = this.textContent; // Text aktualisieren für dropdown1
          optionsContainer.classList.add('select-hide'); // dropdown1 schließen
          customSelect.classList.remove('open'); // Klasse entfernen
        }
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

document.addEventListener('DOMContentLoaded', function () {
  const dropdown = document.getElementById('drop-down-1');
  const selectItems = dropdown.querySelector('.select-items');
  const initialsDisplay = document.getElementById('initials-display');

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const initials = contact.firstName.charAt(0).toUpperCase() + contact.lastName.charAt(0).toUpperCase();

    const optionTemplate = `
          <div class="select-option" id="option-${contact.firstName}-${contact.lastName}" data-value="${contact.firstName} ${contact.lastName}">
              <div class="contact">
                <div class="initial" style="background-color: ${contact.color};">${initials}</div>
                <div class="name">${contact.firstName} ${contact.lastName}</div>
              </div>
              <input type="checkbox" />
              <div class="custom-checkbox"></div>
          </div>
      `;

    selectItems.innerHTML += optionTemplate;
  }

  const dropdownOptions = document.querySelectorAll('.select-option');

  for (let i = 0; i < dropdownOptions.length; i++) {
    dropdownOptions[i].addEventListener('click', function () {
      const checkbox = this.querySelector('input[type="checkbox"]');
      const customCheckbox = this.querySelector('.custom-checkbox');
      const initials = this.querySelector('.initial').textContent;
      const contact = contacts[i];

      checkbox.checked = !checkbox.checked;

      // Toggle die aktive Klasse für die Hintergrundfarbe
      this.classList.toggle('active'); // Klasse für die aktive Hintergrundfarbe hinzufügen/entfernen

      // Toggle die Klasse für die benutzerdefinierte Checkbox
      customCheckbox.classList.toggle('checked'); // Klasse für die benutzerdefinierte Checkbox hinzufügen/entfernen

      // Wenn die Checkbox aktiv ist, füge die Initiale hinzu, andernfalls entferne sie
      if (checkbox.checked) {
        if (!selectedInitials.includes(initials)) {
          selectedInitials.push(initials);
        }
      } else {
        const index = selectedInitials.indexOf(initials);
        if (index > -1) {
          selectedInitials.splice(index, 1);
        }
      }

      // Aktualisiere die Anzeige der Initialen
      initialsDisplay.innerHTML = ''; // Clear previous initials
      selectedInitials.forEach(function (initial) {
        const contactForInitial = contacts.find((contact) => {
          const contactInitials = contact.firstName.charAt(0).toUpperCase() + contact.lastName.charAt(0).toUpperCase();

          return contactInitials === initial;
        });

        if (contactForInitial) {
          initialsDisplay.innerHTML += `<div class="initial" style="background-color: ${contactForInitial.color}; margin-right: 10px;">${initial}</div>`;
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.task-button');

  function updateButtonIcons() {
    buttons.forEach((button) => {
      const color = button.getAttribute('data-color');
      const img = button.querySelector('img');

      // Setze das Bild je nach Aktivitätsstatus des Buttons
      img.src = button.classList.contains('active') ? `/assets/icons/add_tasks/active_icon_${color}.svg` : `/assets/icons/add_tasks/inactive_icon_${color}.svg`;
    });
  }

  function activateButton(selectedButton) {
    // Überprüfen, ob der Button bereits aktiv ist
    if (!selectedButton.classList.contains('active')) {
      // Entferne die aktive Klasse von allen Buttons
      buttons.forEach((button) => button.classList.remove('active'));

      // Füge die aktive Klasse zum ausgewählten Button hinzu
      selectedButton.classList.add('active');

      // Aktualisiere die Icons basierend auf dem aktiven Status
      updateButtonIcons();
    }
  }

  // Füge jedem Button ein Click-Event hinzu
  buttons.forEach((button) => {
    button.addEventListener('click', () => activateButton(button));
  });

  updateButtonIcons();
});

let subtaskCounter = 0; // Zähler für die Subtask-IDs

// Funktion, um ein Subtask hinzuzufügen
function addSubtask() {
  const subtaskInput = document.getElementById("subtaskInput");
  const subtaskValue = subtaskInput.value.trim();

  // Wenn das Subtask nicht leer ist
  if (subtaskValue) {
    // Subtask in die Liste der hinzugefügten Subtasks einfügen
    const subtaskList = document.getElementById("subtaskAddedList");

    // Neues Input-Element für das Subtask
    const subtaskInputElement = document.createElement("input");

    // Berechnen der nächsten verfügbaren ID
    const subtaskId = `subtaskListInput${subtaskCounter}`; // ID basierend auf der Anzahl der Subtasks

    subtaskInputElement.classList.add("subtask-input");
    subtaskInputElement.id = subtaskId; // Eindeutige ID für jedes Subtask
    subtaskInputElement.type = "text";
    subtaskInputElement.value = `• ${subtaskValue}`;
    subtaskInputElement.readOnly = true; // readonly, damit der Text nicht bearbeitet wird

    // Subtask-Element zur Liste hinzufügen
    subtaskList.appendChild(subtaskInputElement);

    // Eingabefeld leeren
    subtaskInput.value = "";

    // Den Subtask-Zähler erhöhen
    subtaskCounter++;
  }
}

// Funktion zum Absenden des Formulars und Speichern der Subtasks und ausgewählten Kontakte
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Verhindert das Standardformular-Absenden

  // Holen der Formulardaten
  const title = document.querySelector("input[type='text']").value;
  const description = document.querySelector("textarea").value;
  const dueDate = document.getElementById("input-field-date").value;
  const priority = document
    .querySelector(".task-button.active")
    .getAttribute("data-color");
  const category = document.querySelector(
    "#drop-down-2 .select-selected"
  ).textContent;

  // Subtasks aus den input-Feldern mit spezifischen IDs holen
  const subtasksList = [];

  // Abrufen der Subtasks anhand ihrer IDs (z.B. subtaskListInput0, subtaskListInput1, ...)
  const subtaskItems = document.querySelectorAll("[id^='subtaskListInput']");

  subtaskItems.forEach((item) => {
    subtasksList.push(item.value.trim()); // Holen des Werts und Entfernen von Leerzeichen
  });

  // Abrufen der aktiven Checkboxen (ausgewählten Kontakte)
  const selectedContacts = [];

  const activeCheckboxes = document.querySelectorAll(
    ".select-option input[type='checkbox']:checked"
  );

  activeCheckboxes.forEach((checkbox) => {
    const parentOption = checkbox.closest(".select-option");
    const name = parentOption.querySelector(".name").textContent; // Holen des Namens
    const initials = parentOption.querySelector(".initial").textContent; // Holen der Initialen

    // Speichern von Name und Initialen des aktiven Kontakts
    selectedContacts.push({ name, initials });
  });

  // Überprüfung, ob Subtasks und ausgewählte Kontakte korrekt abgerufen wurden
  console.log("Subtasks List: ", subtasksList);
  console.log("Selected Contacts: ", selectedContacts);

  // Speichern der Formulardaten im localStorage
  localStorage.setItem("taskTitle", title);
  localStorage.setItem("taskDescription", description);
  localStorage.setItem("taskDueDate", dueDate);
  localStorage.setItem("taskPriority", priority);
  localStorage.setItem("taskCategory", category);

  // Speichern der Subtasks im localStorage
  localStorage.setItem("taskSubtasks", JSON.stringify(subtasksList)); // Subtasks als JSON speichern

  // Speichern der ausgewählten Kontakte im localStorage (mit Name und Initialen)
  localStorage.setItem("taskAssignedTo", JSON.stringify(selectedContacts)); // Kontakte speichern

  alert("Task saved!");
});


// Funktion zum Wechseln zum nächsten Feld basierend auf den IDs
function moveToNextField(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Verhindert das Absenden des Formulars

    // Alle Felder mit den IDs 'input-field-' (z.B. input-field-title, input-field-description, ...)
    const formElements = Array.from(
      document.querySelectorAll('[id^="input-field-"]')
    );

    // Den Index des aktuell fokussierten Elements finden
    const currentIndex = formElements.findIndex((el) => el === event.target);

    // Das nächste Element finden
    let nextElement = formElements[currentIndex + 1];

    // Wenn es das letzte Element 'input-field-date' ist, dann zum 'subtaskInput' springen
    if (!nextElement) {
      nextElement = document.getElementById("subtaskInput"); // Setze den Fokus auf 'subtaskInput'
    }

    // Den Fokus auf das nächste ausfüllbare Element setzen
    if (nextElement) {
      nextElement.focus();
    }
  }
}

// Event-Listener für alle Felder mit den IDs, die mit 'input-field-' beginnen
document.querySelectorAll('[id^="input-field-"]').forEach((input) => {
  input.addEventListener("keydown", moveToNextField);
});

// Speziellen Event-Listener für das 'subtaskInput'-Feld, um das Absenden des Formulars zu verhindern
document.getElementById("subtaskInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Verhindert das Absenden des Formulars im 'subtaskInput'-Feld
    addCurrentSubtask(); // Ruft die Funktion addCurrentSubtask auf (optional, je nachdem, wie du es nutzen möchtest)
  }
});

// Event-Listener für das Formular, um das Absenden bei Enter zu verhindern
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Verhindert das Absenden des Formulars
});


