/**
 * Searches tasks by title or description based on user input.
 * @param {string} inputId - The ID of the input field containing the search term.
 */
function searchTitleOrDescription(inputId) {
  document.getElementById('searchResultMsg').style.opacity = '0';
  document.getElementById('searchResultMsgMobile').style.opacity = '0';
  document.getElementById('searchResultMsg').style.opacity = '0';
  document.getElementById('searchResultMsgMobile').style.opacity = '0';
  let filterWord = document.getElementById(inputId).value.trim().toLowerCase();

  currentTodos = todos.filter((t) => (t.title && t.title.toLowerCase().includes(filterWord)) || (t.description && t.description.toLowerCase().includes(filterWord)));
  if (currentTodos.length === 0) {
    document.getElementById('searchResultMsg').style.opacity = '1';
    document.getElementById('searchResultMsgMobile').style.opacity = '1';
  }
  if (currentTodos.length === 0) {
    document.getElementById('searchResultMsg').style.opacity = '1';
    document.getElementById('searchResultMsgMobile').style.opacity = '1';
  }
  renderTasks();
}
