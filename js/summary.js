function redirectToPage() {
  window.location.href = 'board.html';
}

async function onload() {
  await loadUsersArray();
  greetUser();
  await loadTodosArray();
  getCounts(todos);
  console.log('Todos: ', todos);
  getUpcomingDeadline();
}

function greetUser() {
  const userGreetingElement = document.getElementById('greeting');
  const userNameElement = document.getElementById('userName');

  const userName = getUserName();

  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  userGreetingElement.innerHTML = `${greeting},`;
  userNameElement.innerHTML = `${userName}!`;
}

function getUserName() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get('msg');
  let userName = 'Unknown User';

  if (msg) {
    if (msg !== 'guest') {
      if (users[msg] && users[msg].user && users[msg].user.name) {
        userName = users[msg].user.name;
      }
    } else {
      userName = 'Guest';
    }
  }
  return userName;
}

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

// Funktion, Anzahl Todos für eine bestimmte Kategorie / Priorität berechnen
function getTodoCount(todos, key, value) {
  return todos.filter((todo) => todo[key] === value).length;
}

// Funktion, Anzahl Todos für die Gesamtanzahl berechnen
function getTotalCount(todos) {
  return todos.length;
}

// Funktion, Zählungen der Todos berechnen
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

// Funktion, HTML-Elemente aktualisieren
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

function getUpcomingDeadline() {
  let urgentAmount = todos.filter((todo) => todo['prio'] === 'Urgent');
  let urgentDueDates = urgentAmount.map((todo) => todo.dueDate);
  // const getUrgentAmount = getTodoCount(todos, 'prio', 'Urgent');
  console.log("test: ", urgentDueDates);

  let nextDueDate = getNextDueDate(urgentDueDates);





  document.getElementById('upcomingDeadline').innerHTML = nextDueDateFormatted;


}

function getNextDueDate(urgentDueDates) {
  const dueDatesObjects = urgentDueDates.map(date => {
    return new Date(date);
  });
  let nextDueDate = dueDatesObjects[0];
  for (let i = 1; i < dueDatesObjects.length; i++) {
    if (dueDatesObjects[i] < nextDueDate) {  // Vergleiche jedes Datum mit dem bisherigen frühesten Datum
      nextDueDate = dueDatesObjects[i];  // Setze das neu gefundene frühere Datum als nächstes frühestes Datum
    }
  }
  return nextDueDate;
}


