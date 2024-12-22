/**
 * Initializes content sections and sets up a mutation observer.
 *
 * @function init
 * @returns {void}
 */
function initObserver() {
  const contentElements = getContentElements();
  checkAndInsertText(contentElements);
  const config = { childList: true };
  const observer = createMutationObserver(mutationCallback);
  observeContentElements(observer, contentElements, config);
}

/**
 * Gets all content elements for task display.
 *
 * @function getContentElements
 * @returns {NodeList} - The content elements.
 */
function getContentElements() {
  return document.querySelectorAll('.content');
}

/**
 * Checks each content element and inserts a placeholder if it's empty.
 * @param {HTMLElement[]} contentElements - The list of content elements to check.
 */
function checkAndInsertText(contentElements) {
  contentElements.forEach((element) => {
    if (element.innerHTML.trim() === '') {
      element.innerHTML = `<div class="no-task">No task to do</div>`;

      if (element.id === 'doneContent') {
        changeTextContentDone();
      }
    }
  });
}

/**
 * Creates a new MutationObserver instance with the provided callback.
 * @param {Function} callback - The function to call when mutations are observed.
 * @returns {MutationObserver} - The created MutationObserver instance.
 */
function createMutationObserver(callback) {
  return new MutationObserver(callback);
}

/**
 * Observes the specified content elements for changes using the provided observer.
 * @param {MutationObserver} observer - The observer to use for monitoring changes.
 * @param {HTMLElement[]} contentElements - The elements to observe.
 * @param {Object} config - The configuration options for the observer.
 */
function observeContentElements(observer, contentElements, config) {
  contentElements.forEach((element) => {
    observer.observe(element, config);
  });
}

/**
 * Callback function for handling observed mutations.
 * @param {MutationRecord[]} mutationsList - List of mutations that occurred.
 * @param {MutationObserver} observer - The observer that detected the mutations.
 */
function mutationCallback(mutationsList, observer) {
  mutationsList.forEach(() => {
    checkAndInsertText(getContentElements());
  });
}

/**
 * Changes the text content of the "done" section when there are no completed tasks.
 */
function changeTextContentDone() {
  let parentElement = document.getElementById('doneContent');
  let firstChild = parentElement.children[0];
  firstChild.textContent = 'No task done';
}
