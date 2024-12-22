/**
 * Initializes the application by greeting the user, loading the todos array, updating counts and display getUpcomingDeadline.
 * @async
 * @function onload
 */
async function onload() {
  await isUserLoggedIn();
  mobileGreeting();
  await loadTodosArray();
  getCounts(todos);
  await desktopGreetUser();
  getUpcomingDeadline();
  await generateHeaderInitials();

}

/**
 * Displays a greeting message in a dialog element on mobile view.
 * - Sets the greeting text within the dialog using the current time-based greeting from getGreetingText().
 * - Adds an animation class to make the dialog appear with a specific animation.
 *
 * @function mobileGreeting
 */
function mobileGreeting() {
  let greetingDialog = document.getElementById('greetingDialog');
  greetingDialog.innerHTML = getGreetingText() + '!';
  greetingDialog.classList.add('opacity-animation');
  hideElementAfterTimeout('greetingDialog', 1500);
}

/**
 * Hides an element after a specified delay.
 *
 * @function hideElementAfterTimeout
 * @param {string} elementId - The ID of the element to hide.
 * @param {number} delay - The delay in milliseconds before hiding the element.
 * @returns {void}
 */
function hideElementAfterTimeout(elementId, delay) {
  const element = document.getElementById(elementId);
  if (element) {
    setTimeout(() => {
      element.style.display = 'none';
    }, delay);
  }
}

/**
 * Greets the user based on the current time and displays their name.
 * @function desktopGreetUser
 */
async function desktopGreetUser() {
  const userName = await getUserName();
  const greeting = getGreetingText();
  const userGreetingElement = document.getElementById('greeting');
  const userNameElement = document.getElementById('userName');

  if (userName) {
    userGreetingElement.innerHTML = `${greeting},`;
    userNameElement.innerHTML = `${userName}!`;
  } else {
    userGreetingElement.innerHTML = `${greeting}!`;
  }
}

/**
 * Returns a greeting text based on the current hour of the day.
 * - "Good morning" for hours before 12 PM
 * - "Good afternoon" for hours between 12 PM and 6 PM
 * - "Good evening" for hours after 6 PM
 *
 * @returns {string} A greeting text appropriate to the time of day.
 */
function getGreetingText() {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return 'Good morning';
  } else if (currentHour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Retrieves references to various HTML elements related to todo counts.
 * @returns {Object} An object containing references to the relevant HTML elements.
 * @function getElementReferences
 */
function getElementReferences() {
  const todoAmount = document.getElementById('todoAmount');
  const doneAmount = document.getElementById('doneAmount');
  const urgentAmount = document.getElementById('urgentAmount');
  const taskInBoard = document.getElementById('taskInBoard');
  const taskInProgress = document.getElementById('taskInProgress');
  const taskInFeedback = document.getElementById('taskInFeedback');

  return {
    todoAmount,
    doneAmount,
    urgentAmount,
    taskInBoard,
    taskInProgress,
    taskInFeedback,
  };
}

/**
 * Counts the number of todos matching a specified key-value pair.
 * @param {Array} todos - The array of todo objects.
 * @param {string} key - The property to match.
 * @param {string} value - The value to match.
 * @returns {number} The count of matching todos.
 * @function getTodoCount
 */
function getTodoCount(todos, key, value) {
  return todos.filter((todo) => todo[key] === value).length;
}

/**
 * Calculates the total number of todos in the array.
 * @param {Array} todos - The array of todo objects.
 * @returns {number} The total count of todos.
 * @function getTotalCount
 */
function getTotalCount(todos) {
  return todos.length;
}

/**
 * Calculates and returns counts of todos based on their categories and priorities.
 * @param {Array} todos - The array of todo objects.
 * @returns {Object} An object containing various todo counts.
 * @function calculateTodoCounts
 */
function calculateTodoCounts(todos) {
  const getTodoAmount = getTodoCount(todos, 'category', 'toDo');
  const getDoneAmount = getTodoCount(todos, 'category', 'done');
  const getUrgentAmount = getTodoCount(todos, 'prio', 'urgent');
  const getBoardAmount = getTotalCount(todos);
  const getProgressAmount = getTodoCount(todos, 'category', 'inProgress');
  const getFeedbackAmount = getTodoCount(todos, 'category', 'awaitFeedback');

  return {
    getTodoAmount,
    getDoneAmount,
    getUrgentAmount,
    getBoardAmount,
    getProgressAmount,
    getFeedbackAmount,
  };
}

/**
 * Updates the HTML elements with the calculated counts of todos.
 * @param {Array} todos - The array of todo objects.
 * @function getCounts
 */
function getCounts(todos) {
  const elements = getElementReferences();
  const counts = calculateTodoCounts(todos);

  elements.todoAmount.innerHTML = counts.getTodoAmount;
  elements.doneAmount.innerHTML = counts.getDoneAmount;
  elements.urgentAmount.innerHTML = counts.getUrgentAmount;
  elements.taskInBoard.innerHTML = counts.getBoardAmount;
  elements.taskInProgress.innerHTML = counts.getProgressAmount;
  elements.taskInFeedback.innerHTML = counts.getFeedbackAmount;
}

/**
 * Finds and displays the upcoming deadline for urgent todos.
 * @function getUpcomingDeadline
 */
function getUpcomingDeadline() {
  const urgentAmount = todos.filter((todo) => todo['prio'] === 'urgent' || 'Urgent');
  const urgentDueDates = urgentAmount.map((todo) => todo.dueDate);

  if (urgentDueDates.length) {
    const nextDueDate = getNextDueDate(urgentDueDates);
    const nextDueDateFormatted = formatDate(nextDueDate);
    document.getElementById('upcomingDeadline').innerHTML = nextDueDateFormatted;
  }
}

/**
 * Determines the next due date from an array of due date strings.
 * @param {Array} urgentDueDates - An array of urgent due date strings.
 * @returns {Date} The next due date.
 * @function getNextDueDate
 */
function getNextDueDate(urgentDueDates) {
  const dueDatesObjects = urgentDueDates.map((date) => {
    return new Date(date);
  });
  let nextDueDate = dueDatesObjects[0]; // 'let' statt 'const'
  for (let i = 1; i < dueDatesObjects.length; i++) {
    if (dueDatesObjects[i] < nextDueDate) {
      nextDueDate = dueDatesObjects[i];
    }
  }
  return nextDueDate;
}

/**
 * Formats a date into a human-readable string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 * @function formatDate
 */
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
