/**
 * Starts dragging an element by ID.
 *
 * @function startDragging
 * @param {string} id - The ID of the element being dragged.
 * @returns {void}
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Allows dropping of elements in a drop zone.
 *
 * @function allowDrop
 * @param {Event} event - The drop event.
 * @returns {void}
 */
function allowDrop(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Moves a task to a new category and updates the display.
 *
 * @function moveTo
 * @param {string} newCategory - The new category for the task.
 * @returns {void}
 */
function moveTo(newCategory) {
  todos[currentDraggedElement]['category'] = newCategory;
  editTaskRemote(todoKeysArray[currentDraggedElement], { category: todos[currentDraggedElement].category });
  currentTodos = JSON.parse(JSON.stringify(todos));
  renderTasks();
  removeHighlightAfterDrop();
}

/**
 * Highlights a drop area for drag-and-drop.
 *
 * @function highlight
 * @param {string} id - The ID of the element to highlight.
 * @returns {void}
 */
function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Removes highlight from a drop area.
 *
 * @function removeHighlight
 * @param {string} id - The ID of the element to unhighlight.
 * @returns {void}
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * Removes highlight from all drop areas after a drop action.
 *
 * @function removeHighlightAfterDrop
 * @returns {void}
 */
function removeHighlightAfterDrop() {
  let contentElements = document.getElementsByClassName('content');
  for (let i = 0; i < contentElements.length; i++) {
    contentElements[i].classList.remove('drag-area-highlight');
  }
  document.getElementById('doneContent').classList.remove('drag-area-highlight');
}
