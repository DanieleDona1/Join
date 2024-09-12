// async function includeHTML() {
//     let includeElements = document.querySelectorAll("[w3-include-html]");
//     for (let i = 0; i < includeElements.length; i++) {
//       const element = includeElements[i];
//       file = element.getAttribute("w3-include-html"); // "includes/header.html"
//       let resp = await fetch('/' + file);
//       if (resp.ok) {
//         element.innerHTML = await resp.text();
//       } else {
//         element.innerHTML = "Page not found";
//       }
//     }
//   }


// document.addEventListener("DOMContentLoaded", function() {
//     let includeElements = document.querySelectorAll("[include-html]");

//     includeElements.forEach(element => {
//         let file = element.getAttribute("include-html"); // Nimmt den Dateipfad aus dem Attribut
//         if (file) {
//             fetch('/' + file)
//                 .then(response => response.text())
//                 .then(data => {
//                     element.innerHTML = data;
//                 })
//                 .catch(error => console.error('Error loading file:', error));
//         }
//     });
// });

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