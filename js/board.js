let todos = [];

const BASE_URL =
  "https://joinremotestorage-c8226-default-rtdb.europe-west1.firebasedatabase.app/";

function onload() {
    // addTodo("Template", "Erstellung HTML Template", "Lars", "2017-01-01", "toDo", "technical task",);
    // addTodo("Recipe", "Erstellung neuen Rezept", "", "2017-01-01", "inProgress", "user story",);
    // addTodo("Kochwelt", "Architecture", "Peter", "2017-03-01", "done", "user story",); 
}


// function addTodo(title, description, assignedTo, dueDate, swimlane, task_category) {
//     postData("/todos", { title: title, description: description, assignedTo: assignedTo, dueDate: dueDate, swimlane: swimlane, task_category: task_category, });
// }

// async function postData(path="", data={}){
//     let response = await fetch(BASE_URL + path + ".json", {
//         method: "POST",
//         header: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data)
//     });
//     return responseToJson = await response.json();
// }




// Fill up empty content section 
function init() {
    const contentElements = getContentElements();
    
    checkAndInsertText(contentElements);
    
    const config = { childList: true };

    const observer = createMutationObserver(mutationCallback);

    observeContentElements(observer, contentElements, config);
}

function getContentElements() {
    return document.querySelectorAll('.content');
}

function checkAndInsertText(contentElements) {
    contentElements.forEach((element) => {
        if (element.innerHTML.trim() === '') {
            element.innerHTML = `<div class="no-task">No task to do</div>`;
        }
    });
}

function createMutationObserver(callback) {
    return new MutationObserver(callback);
}

function observeContentElements(observer, contentElements, config) {
    contentElements.forEach((element) => {
        observer.observe(element, config);
    });
}

function mutationCallback(mutationsList, observer) {
    mutationsList.forEach(() => {
        checkAndInsertText(getContentElements());
    });
}

document.addEventListener("DOMContentLoaded", init);