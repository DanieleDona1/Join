document.addEventListener('DOMContentLoaded', function () {
    const selected = document.querySelector('.select-selected');
    const optionsContainer = document.querySelector('.select-items');

    selected.addEventListener('click', function () {
        optionsContainer.classList.toggle('select-hide');
        selected.parentElement.classList.toggle('open'); // Klasse für die Öffnung hinzufügen
    });

    const options = document.querySelectorAll('.select-option');
    options.forEach(option => {
        option.addEventListener('click', function () {
            selected.textContent = this.textContent; // Auswahl aktualisieren
            optionsContainer.classList.add('select-hide'); // Dropdown schließen
            selected.parentElement.classList.remove('open'); // Klasse entfernen, wenn geschlossen
        });
    });

    // Schließe das Dropdown, wenn außerhalb geklickt wird
    document.addEventListener('click', function (e) {
        if (!selected.contains(e.target) && !optionsContainer.contains(e.target)) {
            optionsContainer.classList.add('select-hide');
            selected.parentElement.classList.remove('open'); // Klasse entfernen, wenn geschlossen
        }
    });
});

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
