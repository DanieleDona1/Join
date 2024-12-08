const selectedInitials = [];

async function onloadAddtasks() {
  await isUserLoggedIn();
  await generateHeaderInitials();
  await createContactlistAddTask();
  loadDropDown();
  subtaskKeyDownAddSubtask();
}

// FunktionAufteilen vollständigen Namens in Vorname und Nachname
function splitName(fullName) {
  let nameParts = fullName.split(' ');
  let firstName = nameParts[0];
  let lastName = nameParts.slice(1).join(' ');

  return { firstName, lastName };
}

// Funktion zum Erstellen der Kontaktliste
async function createContactlistAddTask() {
  let data = await loadData('contacts');
  let contactKeys = Object.keys(data);

  for (let i = 0; i < contactKeys.length; i++) {
    let fullName = data[contactKeys[i]].name;
    let { firstName, lastName } = splitName(fullName);

    contactList.push({
      id: contactKeys[i],
      color: data[contactKeys[i]].color,
      firstName: firstName,
      lastName: lastName,
    });
  }
}

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
  const customSelects = document.querySelectorAll('.add-task-custom-select');

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

// bereitet die Dropdown Optionen und eine Anzeige für Initialen vor.
function loadDropDown() {
  const dropdown = document.getElementById('drop-down-1');
  const selectItems = dropdown.querySelector('.select-items');
  const initialsDisplay = document.getElementById('initials-display');

  createContactOptions(selectItems);
  handleDropdownOptions(initialsDisplay);
}

// Erstellt alle Optionen im Dropdown-Menü basierend auf den Kontakten
function createContactOptions(selectItems) {
  contactList.forEach((contact) => {
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
// Überprüft, ob das Dropdown 'drop-down-2' ist
function isDropDown2(option) {
  const dropdownParent = option.closest('.add-task-custom-select');
  return dropdownParent && dropdownParent.id === 'drop-down-2';
}

// Schaltet das Kontrollkästchen und die zugehörigen Klassen um
function toggleCheckboxAndClasses(option) {
  const checkbox = option.querySelector('input[type="checkbox"]');
  const customCheckbox = option.querySelector('.custom-checkbox');
  const initials = option.querySelector('.initial').textContent;

  checkbox.checked = !checkbox.checked;
  option.classList.toggle('active');
  customCheckbox.classList.toggle('checked');

  return { initials, checked: checkbox.checked };
}

// Aktualisiert das 'selectedInitials'-Array basierend auf dem Kontrollkästchen-Status
function updateSelectedInitials(initials, checked) {
  if (checked) {
    if (!selectedInitials.includes(initials)) {
      selectedInitials.push(initials);
    }
  } else {
    const idx = selectedInitials.indexOf(initials);
    if (idx > -1) {
      selectedInitials.splice(idx, 1);
    }
  }
}

// Hauptfunktion zur Handhabung der Auswahl einer Option
function toggleOptionSelection(option, index) {
  if (isDropDown2(option)) {
    return;
  }

  const { initials, checked } = toggleCheckboxAndClasses(option);
  updateSelectedInitials(initials, checked);
}

// Beispiel: Hinzufügen der Event Listener für die Optionen
function handleDropdownOptions(initialsDisplay) {
  const dropdownOptions = document.querySelectorAll('.select-option');

  dropdownOptions.forEach((option, index) => {
    option.addEventListener('click', function () {
      toggleOptionSelection(this, index);
      updateInitialsDisplay(initialsDisplay);
    });
  });
}

// Aktualisiert die Anzeige der Initialen auf der Seite
function updateInitialsDisplay(initialsDisplay) {
  initialsDisplay.innerHTML = '';

  selectedInitials.forEach((initial) => {
    const contactForInitial = findContactByInitial(initial);
    if (contactForInitial) {
      initialsDisplay.innerHTML += createInitialElement(contactForInitial);
    }
  });
}

// Sucht Kontakt basierend auf Initialen
function findContactByInitial(initial) {
  return contactList.find((contact) => {
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

function activeCheckboxesRemote() {
  const activeCheckboxes = document.querySelectorAll(".select-option input[type='checkbox']:checked");

  activeCheckboxes.forEach((checkbox) => {
    const parentOption = checkbox.closest('.select-option');
    const name = parentOption.querySelector('.name').textContent;
    const contact = contactList.find((contact) => `${contact.firstName} ${contact.lastName}` === name);

    selectedContacts.push(contact.id);
  });
}

// springt zum nächsten Inputfeld beim betätigen der Enter Taste
function moveToNextField(event) {
  if (event.key === 'Enter') {
    event.preventDefault();

    const formElements = Array.from(document.querySelectorAll('[id^="input-field-"]'));
    const currentIndex = formElements.findIndex((el) => el === event.target);
    let nextElement = formElements[currentIndex + 1];

    if (!nextElement) {
      nextElement = document.getElementById('subtaskInput');
    }

    nextElement.focus(); // Fokus auf das nächste Element setzen
  }
}

// Event Listener für Inputfeld beim betätigen der Enter Taste
document.querySelectorAll('[id^="input-field-"]').forEach((input) => {
  input.addEventListener('keydown', moveToNextField);
});

function subtaskKeyDownAddSubtask() {
  const subtaskInput = document.getElementById('subtaskInput');
  if (subtaskInput) {
    subtaskInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        if (event.target.value.trim() === '') {
          event.preventDefault();
        } else {
          addCurrentSubtask();
          event.preventDefault();
        }
      }
    });
  }
}

// btn listener cleared alle Inputfelder
function resetForm() {
  document.getElementById('form-add-task').reset();
}

// Funktion zum Zurücksetzen der Prioritätsbuttons
function resetPriorityButtons() {
  document.querySelectorAll('.task-button').forEach((button) => {
    button.classList.remove('active');
    const img = button.querySelector('img');
    const color = button.getAttribute('data-color');
    img.src = `/assets/icons/add_tasks/inactive_icon_${color}.svg`;
  });
}

// Funktion zum Setzen des Standard-Prioritätsbuttons (Medium)
function setDefaultPriority() {
  const mediumButton = document.querySelector("[data-color='medium']");
  mediumButton.classList.add('active');

  const mediumButtonImg = mediumButton.querySelector('img');
  mediumButtonImg.src = `/assets/icons/add_tasks/active_icon_medium.svg`;
}

// Funktion zum Entfernen der Subtasks
function clearSubtasks() {
  removeAddedSubtask('all');
}

// Funktion zum Ausblenden aller Fehlermeldungen
function hideAllErrorMessages() {
  const errorMessages = document.querySelectorAll('.error-msg-addtask');
  errorMessages.forEach((error) => error.classList.add('d-none'));
}

// Funktion zum Zurücksetzen des Dropdowns für die Aufgabenkategorie (drop-down-2)
function resetCategoryDropdown() {
  const dropDown2 = document.getElementById('drop-down-2');
  const selectedCategory = dropDown2.querySelector('.select-selected');
  selectedCategory.textContent = 'Select task category';

  currentTaskCategory = '';
}

// Funktion zum Entfernen der aktiven Klasse von Kategorie-Optionen
function resetCategoryOptions() {
  const dropDown2 = document.getElementById('drop-down-2');
  const categoryOptions = dropDown2.querySelectorAll('.select-option');
  categoryOptions.forEach((option) => {
    option.classList.remove('active');
  });
}

// Funktion zum Leeren der Arrays für ausgewählte Initialen und Kontakte
function clearSelectedContacts() {
  selectedInitials.length = 0;
  selectedContacts.length = 0;
}

// Funktion zum Leeren der Anzeige der Initialen
function clearInitialsDisplay() {
  document.getElementById('initials-display').innerHTML = '';
}

// Funktion zum Deaktivieren aller Kontrollkästchen und Entfernen aktiver Klassen im Kontaktdropdown
function uncheckAllContactOptions(dropDown) {
  const selectOptions = dropDown.querySelectorAll('.select-option');
  selectOptions.forEach((option) => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    const customCheckbox = option.querySelector('.custom-checkbox');
    if (checkbox.checked) {
      checkbox.checked = false;
    }
    option.classList.remove('active');
    customCheckbox.classList.remove('checked');
  });
}

// Funktion zum Zurücksetzen des Kontaktdropdowns (drop-down-1)
function resetContactsDropdown() {
  const dropDown1 = document.getElementById('drop-down-1');
  const selectedContactsDiv = dropDown1.querySelector('.select-selected');
  selectedContactsDiv.textContent = 'Select contacts to assign';

  clearSelectedContacts();
  clearInitialsDisplay();
  uncheckAllContactOptions(dropDown1);
}

// Funktion zum Zurücksetzen aller Komponenten
function clearAll() {
  resetForm();
  resetPriorityButtons();
  setDefaultPriority();
  clearSubtasks();
  hideAllErrorMessages();
  resetCategoryDropdown();
  resetCategoryOptions();
  resetContactsDropdown();
}

// Funktion zum Binden der clearAll-Funktion an den "Clear"-Button
function setClearButtonHandler() {
  const clearButton = document.getElementById('clear-button');
  if (clearButton) {
    clearButton.addEventListener('click', clearAll);
  }
}

document.addEventListener('DOMContentLoaded', setClearButtonHandler);

// Die Funktion wird ausgeführt, wenn auf den Button Create Task geklickt und damit die Task erstellt wird
async function createAddTask(category) {
  if (checkRequiredFields()) {
    activeCheckboxesRemote();
    formateDueDate();
    const userInputData = getUserAddTaskData(category); //hier werden alle Daten geholt die der User in add Task eingegeben hat
    await addTask(userInputData); //hier werden die geholten Daten auf Firebase gespeichert
    redirectToPage('board.html'); //hier wird auf board.html weitergeleitet, dort erscheint automatisch die neu erstellte Task in der toDo Category
  }
}

function checkRequiredFields() {
  let valid = true;

  valid &= checkField('input-field-title', 'titleError');
  valid &= checkField('input-field-date', 'dueDateError');
  valid &= checkCategory();

  return valid;
}

function checkField(inputId, errorId) {
  let input = document.getElementById(inputId);
  let error = document.getElementById(errorId);

  if (input.value.trim() === '') {
    error.classList.remove('d-none');
    return false;
  }
  return true;
}

function checkCategory() {
  let categoryError = document.getElementById('categoryError');

  if (currentTaskCategory === '') {
    categoryError.classList.remove('d-none');
    return false;
  }
  return true;
}

// wird ausgeführt wenn auf einer der priority button geklickt wird, und speichert den ausgewählten button in der activePriority Variable in der script.js
function setPriority() {
  setTimeout(() => {
    activePriority = document.querySelector('.task-button.active').getAttribute('data-color');
  }, 10);
}

// wird ausgeführt wenn eine Category ausgesucht wurde Technical-Task oder User-Story. Das Ausgewählte wird in currentTaskCategory gespeichert
function setCategory(choosenCategory) {
  currentTaskCategory = choosenCategory;
}

// DueDate muss in einem bestimmten Format sein
function formateDueDate() {
  const inputDate = document.getElementById('input-field-date')?.value;
  console.log('inputDate:', typeof inputDate);

  dueDate = formatDateToYMD(inputDate);
  if (dueDate === 'NaN-NaN-NaN') {
    console.log('lol');
  }
}

function formatDateToYMD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
