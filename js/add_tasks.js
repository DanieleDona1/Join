const contacts = [
  { firstName: "Sofia", lastName: "Müller", color: "red" },
  { firstName: "Anton", lastName: "Mayer", color: "blue" },
  { firstName: "Anja", lastName: "Schulz", color: "green" },
  { firstName: "Benedikt", lastName: "Ziegler", color: "purple" },
  { firstName: "David", lastName: "Eisenberg", color: "orange" },
  { firstName: "Max", lastName: "Mustermann", color: "brown" },
];

const selectedInitials = [];

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

document.addEventListener("DOMContentLoaded", function () {
  // Hole alle Dropdowns
  const customSelects = document.querySelectorAll(".custom-select");

  customSelects.forEach((customSelect) => {
    const selected = customSelect.querySelector(".select-selected");
    const optionsContainer = customSelect.querySelector(".select-items");
    const selectId = customSelect.getAttribute("id");

    // Toggle das Dropdown beim Klicken auf die ausgewählte Option
    selected.addEventListener("click", function () {
      optionsContainer.classList.toggle("select-hide");
      customSelect.classList.toggle("open"); // Klasse für die Öffnung hinzufügen
    });

    const options = optionsContainer.querySelectorAll(".select-option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        // Überprüfe, ob es sich um dropdown1 handelt
        if (selectId === "drop-down-2") {
          selected.textContent = this.textContent; // Text aktualisieren für dropdown1
          optionsContainer.classList.add("select-hide"); // dropdown1 schließen
          customSelect.classList.remove("open"); // Klasse entfernen
        }
      });
    });
  });

  // Schließe das Dropdown, wenn außerhalb geklickt wird
  document.addEventListener("click", function (e) {
    customSelects.forEach((customSelect) => {
      const selected = customSelect.querySelector(".select-selected");
      const optionsContainer = customSelect.querySelector(".select-items");

      if (
        !selected.contains(e.target) &&
        !optionsContainer.contains(e.target)
      ) {
        optionsContainer.classList.add("select-hide");
        customSelect.classList.remove("open"); // Klasse entfernen, wenn geschlossen
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("drop-down-1");
  const selectItems = dropdown.querySelector(".select-items");
  const initialsDisplay = document.getElementById('initials-display');

  // Erstelle Optionen für das Dropdown mit einer for-Schleife
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const initials =
      contact.firstName.charAt(0).toUpperCase() +
      contact.lastName.charAt(0).toUpperCase();

    // HTML-Template für die Option
    const optionTemplate = `
          <div class="select-option" data-value="${contact.firstName} ${contact.lastName}">
              <div class="contact">
                <div class="initial" style="background-color: ${contact.color};">${initials}</div>
                <div class="name">${contact.firstName} ${contact.lastName}</div>
              </div> 
              <input type="checkbox" />
              <div class="custom-checkbox"></div>
          </div>
      `;

    // Option zum Dropdown hinzufügen
    selectItems.innerHTML += optionTemplate; // Füge die Option mit innerHTML hinzu
  }

  const dropdownOptions = document.querySelectorAll(".select-option");

  // Verwende eine for-Schleife, um die Event Listener hinzuzufügen
  for (let i = 0; i < dropdownOptions.length; i++) {
    dropdownOptions[i].addEventListener("click", function () {
      const checkbox = this.querySelector('input[type="checkbox"]');
      const customCheckbox = this.querySelector(".custom-checkbox");
      const initials = this.querySelector(".initial").textContent; 
      const contact = contacts[i];


      // Toggle die Checkbox
      checkbox.checked = !checkbox.checked;

      // Toggle die aktive Klasse für die Hintergrundfarbe
      this.classList.toggle("active"); // Klasse für die aktive Hintergrundfarbe hinzufügen/entfernen

      // Toggle die Klasse für die benutzerdefinierte Checkbox
      customCheckbox.classList.toggle("checked"); // Klasse für die benutzerdefinierte Checkbox hinzufügen/entfernen

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
      initialsDisplay.innerHTML = ""; // Clear previous initials
      for (let j = 0; j < selectedInitials.length; j++) {
        initialsDisplay.innerHTML += `<div class="initial" style="background-color: ${contact.color};">${selectedInitials[j]}</div>`;
      }
    });
  }
});
