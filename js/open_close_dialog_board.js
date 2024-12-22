/**
 * Displays the dialog for task details.
 */
function openDialog() {
  const dialog = document.getElementById('dialog');
  const content = dialog.querySelector('.dialog-content');

  content.classList.remove('slide-out');
  dialog.style.display = 'flex';
}

/**
 * Closes the task details dialog and resets the search field if necessary.
 */
function closeDialog(e) {
  const popup = document.querySelector('.pop-up-add-Task');
  if (popup && e && popup.contains(e.target)) return;
  animationSlideOut();
  let filled = document.getElementById('search');
  if (filled && filled.value != '') {
    filled.value = '';
    currentTodos = JSON.parse(JSON.stringify(todos));
    renderTasks();
  }
  currentTodos = JSON.parse(JSON.stringify(todos));
  clearAllArrays();
}
