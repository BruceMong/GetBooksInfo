import './style.css'






const apiKeyInput = document.getElementById('apikey');
const input = document.getElementById('search-text');
const button = document.getElementById('search-button');
const searchContainer = document.getElementById('search-container');
const form = document.getElementById('form');
const langRestrictInput = document.getElementById('langRestrict')
const itemNumberInput = document.getElementById('itemNumber')
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
    let totalItems = itemNumberInput.value; // Nombre total de résultats (initialisé à une valeur très grande)
    let books = []; // Tableau pour stocker les livres récupérés
    const keyword = input.value
    const langRestrict = langRestrictInput.value
    console.log(langRestrict)
    let test = 0;
    const apiKey = apiKeyInput.value
    if (apiKey == "") return

    while (startIndex < totalItems) {
        // Faire une requête à l'API Google Books avec le mot clé, la clé API et les paramètres de pagination
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${keyword}&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=${langRestrict}&key=${apiKey}`);
            const data = await response.json();
            if (data.items === undefined)
                break;
            test++
            console.log(test)
            console.log(data)


            // Vérifier si la réponse contient des résultats
            if (data.totalItems > 0) {
                // Mettre à jour le nombre total de résultats

                // Ajouter les livres de la réponse au tableau
                books = books.concat(data.items.map((book) => {
                    const volumeInfo = book.volumeInfo;
                    return {
                        title: volumeInfo.title || 'unknown',
                        subtitle: volumeInfo.subtitle || 'unknown',
                        authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'unknown',
                        publishedDate: volumeInfo.publishedDate || 'unknown',
                        language: volumeInfo.language || 'unknown',
                        categories: volumeInfo.categories ? volumeInfo.categories.join(', ') : 'unknown',
                        description: volumeInfo.description || 'unknown',
                        maturityRating: volumeInfo.maturityRating || 'unknown',
                        pageCount: volumeInfo.pageCount || 'unknown',
                        infoLink: volumeInfo.infoLink || 'unknown',
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
    displayBooksInDataTable(books)
        //return books;
    return
}

const displayBooksInDataTable = (books) => {
    // Initialiser le tableau DataTables
    if (table != null) {
        table.destroy();
    }
    table = $('#example').DataTable({
        data: books,
        columns: [
            { title: "title", data: 'title' },
            { title: "subtitle", data: 'subtitle' },
            { title: "authors", data: 'authors' },
            { title: "publishedDate", data: 'publishedDate' },
            { title: "language", data: 'language' },
            { title: "categories", data: 'categories' },
            { title: "maturityRating", data: 'maturityRating' },
            { title: "pageCount", data: 'pageCount' },
            { title: "infoLink", data: 'infoLink' },
        ],
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel'
        ]
    });


}

button.addEventListener('click', getBooks);


const modalButton = document.getElementById('modalButton')


// Get the modal
var modal = document.getElementById("modalInfo");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


modalButton.onclick = function() {
        modal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}