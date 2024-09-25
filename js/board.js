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