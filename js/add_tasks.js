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

function formatDate(input) {
  let value = cleanInput(input.value);
  let { day, month, year } = extractDateParts(value);
  ({ day, month } = validateDate(day, month));
  input.value = formatOutput(day, month, year);
}

function cleanInput(value) {
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
  day = day > 31 ? '31' : day;
  month = month > 12 ? '12' : month;
  return { day, month };
}

function formatOutput(day, month, year) {
  let output = day;
  if (month) output += '/' + month;
  if (year) output += '/' + year;
  return output;
}

document.addEventListener('DOMContentLoaded', function () {
  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach((customSelect) => {
    const selected = customSelect.querySelector('.select-selected');
    const optionsContainer = customSelect.querySelector('.select-items');
    const selectId = customSelect.getAttribute('id');

    selected.addEventListener('click', function () {
      optionsContainer.classList.toggle('select-hide');
      customSelect.classList.toggle('open');
    });

    const options = optionsContainer.querySelectorAll('.select-option');
    options.forEach((option) => {
      option.addEventListener('click', function () {
        if (selectId === 'drop-down-2') {
          selected.textContent = this.textContent;
          optionsContainer.classList.add('select-hide');
          customSelect.classList.remove('open');
        }
      });
    });
  });

  // öffnet drop down?
  document.addEventListener('click', function (e) {
    customSelects.forEach((customSelect) => {
      const selected = customSelect.querySelector('.select-selected');
      const optionsContainer = customSelect.querySelector('.select-items');

      if (!selected.contains(e.target) && !optionsContainer.contains(e.target)) {
        optionsContainer.classList.add('select-hide');
        customSelect.classList.remove('open');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const dropdown = document.getElementById('drop-down-1');
  const selectItems = dropdown.querySelector('.select-items');
  const initialsDisplay = document.getElementById('initials-display');

  createContactOptions(selectItems);
  handleDropdownOptions(initialsDisplay);
});

// Erstellt alle Optionen im Dropdown-Menü basierend auf den Kontakten
function createContactOptions(selectItems) {
  contacts.forEach(contact => {
    const initials = getInitials(contact);
    const optionTemplate = getOptionTemplate(contact, initials);
    selectItems.innerHTML += optionTemplate;
  });
}

// Gibt Initialen eines contacts zurück
function getInitials(contact) {
  return contact.firstName.charAt(0).toUpperCase() + contact.lastName.charAt(0).toUpperCase();
}

// html template Kontaktoption
function getOptionTemplate(contact, initials) {
  return `
    <div class="select-option" id="option-${contact.firstName}-${contact.lastName}" data-value="${contact.firstName} ${contact.lastName}">
        <div class="contact">
          <div class="initial" style="background-color: ${contact.color};">${initials}</div>
          <div class="name">${contact.firstName} ${contact.lastName}</div>
        </div>
        <input type="checkbox" />
        <div class="custom-checkbox"></div>
    </div>
  `;
}

// Auswahl von Dropdown optionen und das Anzeigen der Initialen
function handleDropdownOptions(initialsDisplay) {
  const dropdownOptions = document.querySelectorAll('.select-option');

  dropdownOptions.forEach((option, index) => {
    option.addEventListener('click', function () {
      toggleOptionSelection(this, index);
      updateInitialsDisplay(initialsDisplay);
    });
  });
}

// schaltet die Auswahl einer Option um und aktualisiert
function toggleOptionSelection(option, index) {
  const checkbox = option.querySelector('input[type="checkbox"]');
  const customCheckbox = option.querySelector('.custom-checkbox');
  try {
    const initials = option.querySelector('.initial').textContent;
    const contact = contacts[index];

    checkbox.checked = !checkbox.checked;
    option.classList.toggle('active');
    customCheckbox.classList.toggle('checked');

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
  } catch {}
  }

  // Aktualisiert die Anzeige der Initialen auf der Seite
function updateInitialsDisplay(initialsDisplay) {
  initialsDisplay.innerHTML = '';

  selectedInitials.forEach(initial => {
    const contactForInitial = findContactByInitial(initial);
    if (contactForInitial) {
      initialsDisplay.innerHTML += createInitialElement(contactForInitial);
    }
  });
}

// Sucht Kontakt basierend auf Initialen
function findContactByInitial(initial) {
  return contacts.find(contact => {
    const contactInitials = getInitials(contact);
    return contactInitials === initial;
  });
}

// Erstellt das html für einzelnen Initiale
function createInitialElement(contact) {
  return `<div class="initial" style="background-color: ${contact.color}; margin-right: 10px;">${getInitials(contact)}</div>`;
}


// Der ausgewählte Prio Button wird in der entsprechenden Farbe angezeigt
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.task-button');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      updateButtonIcons(buttons);
    });
  });
  updateButtonIcons(buttons);
});

// aktualisiert Hintergrundfarbe des ausgewählten prio btn
function updateButtonIcons(buttons) {
  buttons.forEach((button) => {
    const color = button.getAttribute('data-color');
    const img = button.querySelector('img');
    const iconType = button.classList.contains('active') ? 'active' : 'inactive';
    img.src = `/assets/icons/add_tasks/${iconType}_icon_${color}.svg`;
  });
}


// verhindert form tag absendung. selectedContacts Array befüllt. Hier muss color hinzugefügt werden
document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault();

  const activeCheckboxes = document.querySelectorAll(".select-option input[type='checkbox']:checked");

  activeCheckboxes.forEach((checkbox) => {
    const parentOption = checkbox.closest('.select-option');
    const name = parentOption.querySelector('.name').textContent;
    const initials = parentOption.querySelector('.initial').textContent;

    selectedContacts.push({ name, initials });
  });
});

// springt zum nächsten Inputfeld beim betätigen der Enter Taste
function moveToNextField(event) {
  if (event.key === 'Enter') {
    event.preventDefault();

    const formElements = Array.from(document.querySelectorAll('[id^="input-field-"]'));
    const currentIndex = formElements.findIndex((el) => el === event.target);
    let nextElement = formElements[currentIndex + 1];

    if (!nextElement) {
      nextElement = document.getElementById('subtaskInput');
    } else {
      nextElement.focus();
    }
  }
}

// Event Listener für Inputfeld beim betätigen der Enter Taste
document.querySelectorAll('[id^="input-field-"]').forEach((input) => {
  input.addEventListener('keydown', moveToNextField);
});

document.getElementById('subtaskInput').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    if (event.target.value.trim() === '') {
      event.preventDefault();
    } else {
      addCurrentSubtask();
      event.preventDefault();
    }
  }
});

// btn listener cleared alle Inputfelder
document.getElementById('clear-button').addEventListener('click', function () {
  document.getElementById('form-add-task').reset();

  document.querySelectorAll('.task-button').forEach((button) => {
    button.classList.remove('active');
    const img = button.querySelector('img');
    const color = button.getAttribute('data-color');
    img.src = `/assets/icons/add_tasks/inactive_icon_${color}.svg`;
  });

  const mediumButton = document.querySelector("[data-color='medium']");
  mediumButton.classList.add('active');

  const mediumButtonImg = mediumButton.querySelector('img');
  mediumButtonImg.src = `/assets/icons/add_tasks/active_icon_medium.svg`;
});

// Die Funktion wird ausgeführt, wenn auf den Button Create Task geklickt und damit die Task erstellt wird
async function createAddTask(category) {
  //TODO Die 4 Zeilen unter dem Kommentar dürfen nur ausgeführt werden, wenn alle Pflichtfelder ausgefüllt wurden. Also mit if () irgendwie und es müssen die Felder eine error msg geben die leer sind.
  formateDueDate();
  const userInputData = getUserAddTaskData(category); //hier werden alle Daten geholt die der User in add Task eingegeben hat
  await addTask(userInputData); //hier werden die geholten Daten auf Firebase gespeichert
  redirectToPage('board.html'); //hier wird auf board.html weitergeleitet, dort erscheint automatisch die neu erstellte Task in der toDo Category
}

// wird ausgeführt wenn auf einer der priority button geklickt wird, und speichert den ausgewählten button in der activePriority Variable in der script.js
function setPriority() {
  setTimeout(() => {
    activePriority = document.querySelector('.task-button.active').getAttribute('data-color');
    console.log('activePrio:', activePriority);
  }, 10);
}

// wird ausgeführt wenn eine Category ausgesucht wurde Technical-Task oder User-Story. Das Ausgewählte wird in currentTaskCategory gespeichert
function setCategory(choosenCategory) {
  currentTaskCategory = choosenCategory;
}

// DueDate muss in einem bestimmten Format sein
function formateDueDate() {
  const inputDate = document.getElementById('input-field-date')?.value;
  dueDate = formatDateToYMD(inputDate);
}

function formatDateToYMD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
