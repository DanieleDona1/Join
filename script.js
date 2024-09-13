document.addEventListener("DOMContentLoaded", () => {
    let files = ['templates/header.html', 'templates/navbar.html'];
    let elementIds = ['header-div', 'navbar-div'];

    for (let i = 0; i < files.length; i++) {
        fetch('/' + files[i])
            .then(response => response.ok ? response.text() : Promise.reject('Failed to load'))
            .then(data => document.getElementById(elementIds[i]).innerHTML = data)
            .catch(error => console.error('Loading error:', error));
    }
});