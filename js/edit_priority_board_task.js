
/**
 * Sets the focus on the task details based on the current active priority.
 * It adds the 'active' class to the task element that matches the active priority
 * and removes it from the other task elements.
 */
function setFocusBasedOnPriority() {
  const priorities = ['urgent', 'medium', 'low'];
  priorities.forEach((prio) => {
    const element = document.getElementById(`${prio}DetailTask`);
    element.classList.toggle('active', activePriority === prio);
  });
}

/**
 * Sets the active priority based on the given priority value.
 * Updates the activePriority variable to match the provided priority ('urgent', 'medium', or 'low').
 * @param {string} priority - The priority to set ('urgent', 'medium', or 'low').
 */
function setPriorityColor(priority) {
  if (priority === 'urgent') {
    activePriority = 'urgent';
  } else if (priority === 'medium') {
    activePriority = 'medium';
  } else if (priority === 'low') {
    activePriority = 'low';
  }
}

/**
 * Changes the active priority and updates the focus based on the new priority.
 * Sets the activePriority and updates the UI to reflect the new priority's focus.
 * @param {string} priority - The new priority to set ('urgent', 'medium', or 'low').
 */
function changePriority(priority) {
  setPriorityColor(priority);
  setFocusBasedOnPriority();
}
