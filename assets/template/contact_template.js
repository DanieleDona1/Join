/**
 * Generates the HTML for the contact info template.
 * @param {string} groupInitial - Initial of the contact group.
 * @param {number} contactIndex - Index of the contact in the group.
 * @param {Object} contact - Contact object containing the data.
 * @param {string} contactColor - Background color for the contact initials.
 * @param {string} initials - Initials of the contact.
 * @param {string} name - Name of the contact.
 * @param {string} mail - Email of the contact.
 * @param {string} number - Phone number of the contact.
 * @returns {string} HTML string for the contact info template.
 */
function getContactHtmlTemplate(groupInitial, contactIndex, contact, contactColor, initials, name, mail, number) {
    return /*html*/ `
      <div class="info-initial-name">
        <div class="info-initial" style="background-color: ${contactColor};">${initials}</div>
        <div class="info-name-button">
          <div class="info-name">${name}</div>
          <div class="info-buttons" id="editDeleteButtons">
            <button class="info-edit blue-btn-hover" onclick="openEditContact('${groupInitial}', ${contactIndex})">
              <img class="selected-contact-img" src="../assets/icons/contact/contact_info_edit.png" alt="">
              Edit
            </button>
            <button class="info-delete blue-btn-hover" onclick="deleteContact('${contact.id}')">
              <img class="selected-contact-img" src="../assets/icons/contact/contact_info_delete.png" alt="">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div class="info-text">Contact Information</div>
      <div class="info-email-phone">
        <div class="info-email">
          <span>Email</span>
          <a href="mailto:${mail}">${mail}</a>
        </div>
        <div class="info-phone">
          <span>Phone</span>
          <span>${number}</span>
        </div>
      </div>
    `;
  }
  
  
  /**
   * Generates the wrapper HTML for the contact detail view.
   * @param {string} contactHTML - HTML content for the contact.
   * @returns {string} Wrapper HTML for the contact detail view.
   */
  function generateContactWrapperHtml(contactHTML) {
    return /*html*/ `
      <div id="contact-text-small" class="contact-text">
        <span class="span-1">Contacts</span>
        <div class="contact-vector"></div>
        <span class="span-2">Better with a team</span>
      </div>
      <button onclick="closeContactInfoWindow()" class="back-info-wrapper">
        <img src="../assets/icons/arrow_left_line.svg" alt="button-back">
      </button>
      <div class="contact-info-wrapper">
        ${contactHTML}
      </div>
      <button id="toggleButtons">
        <img src="../assets/icons/contact/more_vert.png" alt="">
      </button>
    `;
  }


  /**
 * Returns the HTML template for a contact item.
 * @param {string} initial - Initial of the contact group.
 * @param {string} initials - Initials of the contact.
 * @param {Object} contact - Contact object.
 * @param {number} index - Index of the contact in the group.
 * @param {string} contactColor - Background color for the contact's initials.
 * @returns {string} HTML template for the contact item.
 */
function getContactHTMLTemplate(initial, initials, contact, index, contactColor) {
    return /*html*/ `
      <div class="contact-profil" onclick="toggleContactInfo()">
        <div class="contact-item" onclick="getContactInfo('${initial}', ${index})" tabindex="0">
          <div class="contact-initials" style="background-color: ${contactColor};">${initials}</div>
          <div class="contact-name-mail">
            <div class="contactlist-name">${contact?.user?.name || 'Unbekannt'}</div>
            <div class="contactlist-mail">${contact?.user?.mail || 'Keine E-Mail'}</div>
          </div>
        </div>
      </div>
    `;
  }
  