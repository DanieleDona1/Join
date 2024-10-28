/**
 * Initializes the application by greeting the user, loading the todos array, updating counts and display getUpcomingDeadline.
 * @async
 * @function onload
 */
async function onload() {
  await greetUser();
  await loadTodosArray();
  getCounts(todos);
  getUpcomingDeadline();
}

/**
 * Greets the user based on the current time and displays their name.
 * @function greetUser
 */
async function greetUser() {
  const userGreetingElement = document.getElementById('greeting');
  const userNameElement = document.getElementById('userName');
  const userName = await getUserName();
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  if (userName) {
    userGreetingElement.innerHTML = `${greeting},`;
    userNameElement.innerHTML = `${userName}!`;
  } else {
    userGreetingElement.innerHTML = `${greeting}!`;
  }
}

/**
 * Retrieves the user's name from local storage or returns 'Unknown User' if not found.
 * @returns {string} The name of the user.
 * @function getUserName
 */
async function getUserName() {
  let userName = '';
  let userStorageKey = getFromLocalStorage('user');
  userName = await getDataAsJson(`users/${userStorageKey}/name`);

  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get('msg');

  if (userName) {
    return userName;
  } else if (msg == 'guest') {
    return 'Guest';
  } else {
    return false;
  }
}

/**
 * Retrieves an item from local storage by key.
 * @param {string} key - The key for the local storage item.
 * @returns {string|null} The value stored in local storage, or null if not found.
 * @function getFromLocalStorage
 */
function getFromLocalStorage(key) {
  return localStorage.getItem(key);
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
  const getUrgentAmount = getTodoCount(todos, 'prio', 'Urgent');
  const getBoardAmount = getTotalCount(todos);
  const getProgressAmount = getTodoCount(todos, 'category', 'inProgress');
  const getFeedbackAmount = getTodoCount(todos, 'category', 'awaitingFeedback');

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
  const urgentAmount = todos.filter((todo) => todo['prio'] === 'Urgent');
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
  const nextDueDate = dueDatesObjects[0];
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

/**
 * Redirects the user to the specified page.
 * @function redirectToPage
 */
function redirectToPage() {
  window.location.href = 'board.html';
}
