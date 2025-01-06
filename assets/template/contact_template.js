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


  function generateContactWrapperHtml(contactHTML){
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
  `
  }