// Función para cargar un componente dinámicamente
function loadComponent(urlComponent, idDestination) {
    fetch(urlComponent) //--> Ruta del componente que queremos cargar
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el componente: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => { //--> El html que se carga
            const elementDestination = document.getElementById(idDestination);
            
            if (elementDestination) {
                elementDestination.innerHTML = html; //--> Si existe el elemento, se carga en el idDestino
            } else {
                console.error(`No se encontró el elemento con el ID: ${idDestination}`);
            }
        })
        .catch(error => {
            console.error('Hubo un error al cargar el componente:', error);
        });
    }

    //Funcion para la busqueda de juegos
function searchGame(){
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');

        if(!searchForm || !searchInput) return;

        //TODO:: Terminar de implementar la busqueda cuando se IMPLEMENTE la API
}

//Funcion para mostrar los juegos por genero.
async function filterByGenre(){
    const genreSelect = document.getElementById('categoriesContainer');
    if(!genreSelect) return;

    const datos = await fetchGames();
    if(!datos){
        return console.log('No se pudieron obtener los datos de los juegos.')
    }

    
}