let books = { items: [] };

/**
Recherche dans la base de données de Google Books via leur API publique
et renvoie le résultat. Notez que cette fonction (en raison des restrictions de Google)
effectuera une requête toutes les 40 livres.
Si le nombre de livres demandés n'est pas atteint, ceux trouvés seront renvoyés.
Si aucun livre n'est trouvé, false sera renvoyé.
@param {string} query - Requête de recherche, documentation de l'API
@param {number} numBooksToGet - Nombre de résultats souhaité
@param {number} [startIndex=0] - Index à partir duquel commencer la recherche (facultatif)
@return {boolean|object} - False si aucun livre n'est trouvé, sinon les livres trouvés
*/
function getBooks(query, numBooksToGet, startIndex = 0) {

    // Si nous avons déjà récupéré tous les livres nécessaires, ou
    // que tous les résultats sont déjà stockés
    if (books.items.length >= numBooksToGet)
        return books;

    let booksNeeded = numBooksToGet - books.items.length;

    // Le maximum de livres / requête = 40, c'est donc notre limite
    if (booksNeeded > 40)
        booksNeeded = 40;

    let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${booksNeeded}`;

    // Récupérer les données avec cURL
    fetch(url)
        .then(response => response.json())
        .then(bookBatch => {
            // Si nous n'avons aucune correspondance..
            if (bookBatch.totalItems === 0) {

                // .. mais que nous avons déjà des livres, renvoyer ceux-là
                if (books.items.length > 0)
                    return books;
                else
                    return false;

            }

            // Fusionner les livres existants avec les nouveaux livres de cette requête 
            books.items.push(...bookBatch.items);

            // Même si nous VOULONS plus de livres, mais que l'API ne peut pas nous en donner plus: arrêter
            if ((bookBatch.totalItems - books.items.length) === 0) {
                return books;
            }

            // Nous avons besoin de plus de livres, et il y en a plus à obtenir : utiliser la récursivité
            return getBooks(query, numBooksToGet, startIndex + booksNeeded);
        })
        .catch(error => console.error(error));

}