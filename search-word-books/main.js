import './style.css'

// $(document).ready(function() {
//     $('#example').DataTable(

//         {

//             "aLengthMenu": [
//                 [5, 10, 25, -1],
//                 [5, 10, 25, "All"]
//             ],
//             "iDisplayLength": 5
//         }
//     );
// });





// Clé d'API Google Books
const apiKey = "AIzaSyAZ9hTF1EWxsKT15apLE9Rwkl8lZyypJns";

// URL de l'API Google Books
const apiUrl = "https://www.googleapis.com/books/v1/volumes?q=";

const input = document.getElementById('search-text');
const button = document.getElementById('search-button');
const searchContainer = document.getElementById('search-container');
const form = document.getElementById('form');
var table = null

// Interception de l'événement de soumission du formulaire
document.querySelector('form').addEventListener('submit', function(event) {
    // Vérification si la touche "Entrée" a été pressée
    if (event.keyCode === 13 || event.which === 13) {
        // Empêcher la soumission du formulaire
        event.preventDefault();
        return false;
    }
});





async function getBooks() {
    const maxResults = 40; // Nombre maximum de résultats par requête
    let startIndex = 0; // Indice de départ pour les résultats
    let totalItems = 10000; // Nombre total de résultats (initialisé à une valeur très grande)
    let books = []; // Tableau pour stocker les livres récupérés
    const keyword = input.value
    let test = 0;

    while (startIndex < totalItems) {
        // Faire une requête à l'API Google Books avec le mot clé, la clé API et les paramètres de pagination
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${keyword}&startIndex=${startIndex}&maxResults=${maxResults}&key=${apiKey}`);
            const data = await response.json();
            if (data.items === undefined)
                break;
            test++
            console.log(test)
            console.log(data)


            // Vérifier si la réponse contient des résultats
            if (data.totalItems > 0) {
                // Mettre à jour le nombre total de résultats
                totalItems = data.totalItems;

                // Ajouter les livres de la réponse au tableau
                books = books.concat(data.items.map((book) => {
                    const volumeInfo = book.volumeInfo;
                    return {
                        title: volumeInfo.title || 'Titre inconnu',
                        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Auteur inconnu',
                        date: volumeInfo.publishedDate || 'Date inconnue'
                    }
                }));
            }

            // Mettre à jour l'indice de départ pour les résultats suivants
            startIndex += maxResults;

        } catch (e) {
            console.log(e)
        }
    }

    console.log(books)
    return books;
}


// Fonction pour effectuer la requête à l'API
// const getBooks = () => {
//     console.log("caca")
//     const keyword = input.value
//     const url = apiUrl + keyword + "&key=" + apiKey;

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data)
//                 // Récupérer les informations de chaque livre
//             const books = data.items.map(item => {
//                 // Récupérer le titre du livre
//                 const title = item.volumeInfo.title;

//                 // Récupérer les auteurs
//                 let authors = "";
//                 if (item.volumeInfo.authors) {
//                     authors = item.volumeInfo.authors.join(", ");
//                 }

//                 // Récupérer la date de publication
//                 const date = item.volumeInfo.publishedDate;

//                 // Retourner les informations du livre sous forme d'objet
//                 return { title, authors, date };
//             });

//             // Initialiser le tableau DataTables
//             if (table != null) {
//                 table.destroy();
//             }

//             table = $('#example').DataTable({
//                 data: books,
//                 columns: [
//                     { data: 'title' },
//                     { data: 'authors' },
//                     { data: 'date' }
//                 ],
//                 dom: 'Bfrtip',
//                 buttons: [
//                     'copy', 'csv', 'excel'
//                 ]
//             });

//             // Afficher le tableau
//             // $('#example').show();


//             //searchContainer.style.display = "none"

//         })
//         .catch(error => {
//             // Gestion des erreurs
//             console.error(error);
//         });
// }




// // Fonction pour effectuer la requête à l'API
// const getBooks = () => {
//     console.log("caca")
//     const keyword = input.value
//     const maxResults = 40; // nombre maximal de résultats à récupérer
//     let startIndex = 0; // index de départ pour la récupération des résultats
//     let totalItems = 0; // nombre total d'éléments à récupérer
//     let books = []; // tableau pour stocker les livres récupérés
//     let max = 0
//         // Boucle pour récupérer tous les résultats
//     while (startIndex < totalItems || startIndex === 0 || max == 3) {
//         const url = apiUrl + keyword + `&key=${apiKey}&startIndex=${startIndex}&maxResults=${maxResults}`;
//         max++;
//         fetch(url)
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data)
//             })
//             .catch(error => {
//                 // Gestion des erreurs
//                 console.error(error);
//             });
//     }
// };

button.addEventListener('click', getBooks);