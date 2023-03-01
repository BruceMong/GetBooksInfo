import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'








// Clé d'API Google Books
const apiKey = "AIzaSyAZ9hTF1EWxsKT15apLE9Rwkl8lZyypJns";

// URL de l'API Google Books
const apiUrl = "https://www.googleapis.com/books/v1/volumes?q=";

const input = document.getElementById('input');
const button = document.getElementById('search-button');
const searchContainer = document.getElementById('search-container');
const form = document.getElementById('form');

form.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Empêche la soumission par défaut
        getBooks(); // Appelle votre fonction personnalisée
    }
});
// Fonction pour effectuer la requête à l'API
const getBooks = () => {
    const keyword = input.value
    const url = apiUrl + keyword + "&key=" + apiKey;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
                // Récupérer les informations de chaque livre
            const books = data.items.map(item => {
                // Récupérer le titre du livre
                const title = item.volumeInfo.title;

                // Récupérer les auteurs
                let authors = "";
                if (item.volumeInfo.authors) {
                    authors = item.volumeInfo.authors.join(", ");
                }

                // Récupérer la date de publication
                const date = item.volumeInfo.publishedDate;

                // Retourner les informations du livre sous forme d'objet
                return { title, authors, date };
            });

            // Initialiser le tableau DataTables
            const table = $('#table-books').DataTable({
                data: books,
                columns: [
                    { data: 'title' },
                    { data: 'authors' },
                    { data: 'date' }
                ]
            });

            // Afficher le tableau
            $('#table-books').show();


            searchContainer.style.display = "none"

        })
        .catch(error => {
            // Gestion des erreurs
            console.error(error);
        });
}
button.addEventListener('click', getBooks);