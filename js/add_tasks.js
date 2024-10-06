document.addEventListener('DOMContentLoaded', function initDropdowns() {
  const dropdowns = document.querySelectorAll('.custom-select'); // Erfasse alle Dropdown-Menüs

  dropdowns.forEach(dropdown => {
    const selected = dropdown.querySelector('.select-selected');
    const optionsContainer = dropdown.querySelector('.select-items');
    const options = dropdown.querySelectorAll('.select-option');

    setupDropdownToggle(selected, optionsContainer);
    setupOptionSelection(options, selected, optionsContainer);
    setupClickOutside(dropdown, selected, optionsContainer);
  });
});

// Funktion zum Öffnen/Schließen des Dropdowns
function setupDropdownToggle(selected, optionsContainer) {
  selected.addEventListener('click', function (e) {
    e.stopPropagation(); // Verhindere, dass der Klick sofort das Dropdown schließt
    toggleDropdown(selected, optionsContainer);
  });
}

// Funktion zum Aktualisieren der Auswahl und Schließen des Dropdowns
function setupOptionSelection(options, selected, optionsContainer) {
  options.forEach(option => {
    option.addEventListener('click', function () {
      selectOption(option, selected, optionsContainer);
    });
  });
}

// Funktion zum Schließen des Dropdowns, wenn außerhalb geklickt wird
function setupClickOutside(dropdown, selected, optionsContainer) {
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) { // Stelle sicher, dass der Klick außerhalb des Dropdowns war
      hideDropdown(optionsContainer, selected);
    }
  });
}

// Funktion zum Ein-/Ausblenden des Dropdowns
function toggleDropdown(selected, optionsContainer) {
  optionsContainer.classList.toggle('select-hide');
  selected.parentElement.classList.toggle('open');
}

// Funktion zum Aktualisieren des ausgewählten Textes und Schließen des Dropdowns
function selectOption(option, selected, optionsContainer) {
  selected.textContent = option.textContent;
  hideDropdown(optionsContainer, selected);
}

// Funktion zum Schließen des Dropdowns
function hideDropdown(optionsContainer, selected) {
  optionsContainer.classList.add('select-hide');
  selected.parentElement.classList.remove('open');
}



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
      year: value.substring(4, 8)
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

  

  