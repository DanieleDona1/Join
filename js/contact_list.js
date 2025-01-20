/**
 * Sorts the contact list alphabetically by name.
 * @param {Array<Object>} contacts - List of contact objects.
 * @returns {Array<Object>} Sorted list of contacts.
 */
function sortContacts(contacts) {
    return contacts.sort((a, b) => a.user.name.localeCompare(b.user.name));
  }
  
  /**
   * Groups contacts by their initials.
   * @param {Array<Object>} contacts - List of contact objects.
   * @returns {Object} Grouped contacts by initials.
   */
  function groupContactsByInitial(contacts) {
    const grouped = {};
    contacts.forEach((contact) => {
      const initial = contact.user.name.charAt(0).toUpperCase();
      if (!grouped[initial]) {
        grouped[initial] = [];
      }
      grouped[initial].push(contact);
    });
    return grouped;
  }

/**
 * Transforms a contact object into a consistent format.
 * @param {Object} contact - Contact object to transform.
 * @returns {Object | null} Transformed contact object or null if invalid.
 */
function transformContact(contact) {
    if (!contact) return null;
  
    return {
      id: contact.id,
      color: contact.color,
      user: {
        initials: contact.initials,
        name: contact.name,
        mail: contact.mail,
        number: contact.number,
      },
    };
  }

/**
 * Extracts initials from a full name.
 * @param {string} fullName - Full name of the contact.
 * @returns {string} Initials derived from the full name.
 */
function getInitials(fullName) {
    const nameParts = fullName.split(' ');
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
    const lastInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }
  
  /**
   * Generates a random hexadecimal color string.
   * @returns {string} A random hex color code.
   */
  function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  /**
   * Retrieves updated contact data from the edit form inputs.
   * @returns {Object} Updated contact data object containing name, mail, and number.
   */
  function getUpdatedContactData() {
    return {
      name: document.getElementById('edit-name').value,
      mail: document.getElementById('edit-email').value,
      number: document.getElementById('edit-phonenumber').value,
    };
  }

/**
 * Sorts all groups in the grouped contacts by contact names.
 */
function sortGroupedContacts() {
    Object.keys(groupedContacts).forEach((groupKey) => {
      groupedContacts[groupKey].sort((a, b) => {
        const nameA = a.user?.name || a.name || '';
        const nameB = b.user?.name || b.name || '';
        return nameA.localeCompare(nameB);
      });
    });
  }
  