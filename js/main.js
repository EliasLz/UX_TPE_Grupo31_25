import { fetchGames } from "./fetchApi.js";
import {simulateProgress} from "./spiner.js";

// Función para cargar un componente dinámicamente.
export function loadComponent(urlComponent, idDestination) {
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

//Funcion para crear las cards de los juegos de forma dinamica.
function createGameCard(game) {
    return `
        <div class="game-card">
            <div class="game-card-image-container">
                <img 
                    src="${game.background_image_low_res}" 
                    alt="Imagen de ${game.name}" 
                    class="game-card-image"
                >
                <div class="game-card-overlay">
                    <h3 class="game-card-title">${game.name}</h3>
                </div>
            </div>
        </div>
    `;
}

function createRecommendedCard(game) {
    return `
        <div class="recommended-card">
            <div class="game-card-image-container">
                <img 
                    src="${game.background_image_low_res}" 
                    alt="Imagen de ${game.name}" 
                    class="game-card-image"
                >
                <div class="game-card-overlay">
                    <h3 class="game-card-title">${game.name}</h3>
                </div>
            </div>
            
            <div class="game-card-info" style="display: none;"></div>
        </div>
    `;
}


//Funcion para seleccionar los juegos recomendados.
function selectRecommendedGames(games) {
    let recommendedList = [];
    
    const pegSolitarie = games.find(game => game.id === 1); //--> Aseguramos que el Peg Solitarie este siempre.
    
    if (pegSolitarie) {
        recommendedList.push(pegSolitarie);
    }

    const candidates = games.filter(game => 
        game.rating > 4.5 && game.id !== 1
    );
    

    const countNeeded = 9 - recommendedList.length; 
    
    const getRandomIndex = (max) => Math.floor(Math.random() * max);

    for (let i = 0; i < countNeeded && candidates.length > 0; i++) {
        const randomIndex = getRandomIndex(candidates.length);
        
        // Agregamos el juego seleccionado
        recommendedList.push(candidates[randomIndex]);
        
        // Eliminamos el juego del array de candidatos para evitar duplicados
        candidates.splice(randomIndex, 1);
    }
    
    return recommendedList;
}

async function renderRecommended() {
    const container = document.getElementById('recommendedContainer');
    
    if (!container) {
        console.error('No se encontro el contenedor de juegos recomendados');
        return;
    }

    try {
        const games = await fetchGames(); 
        
        // Seleccionamos los 3 juegos recomendados con la lógica especial
        const recommendedGames = selectRecommendedGames(games);

        if (recommendedGames.length === 0) {
            container.innerHTML = '<p>No hay juegos recomendados.</p>';
            return;
        }

        recommendedGames.forEach(game => {
            const cardHTML = createRecommendedCard(game);
            container.insertAdjacentHTML('beforeend', cardHTML);
        });

    } catch (error) {
        console.error('Error al renderizar los recomendados:', error);
        container.innerHTML = '<p>Error al cargar los juegos recomendados.</p>';
    }
}

//Funcion para crear las secciones de carrusel por genero. 
function createCarouselSection(genreName, games) {
    const gameCards = games.map(game => createGameCard(game)).join('');
    
    return `
        <section class="carousel-section">
            <h2 class="carousel-title">${genreName}</h2>
            <div class="carousel-track categories-container" id="carousel-${genreName.replace(/\s/g, '-')}-track">
            ${gameCards}
            </div>
        </section>
    `;
}

//Agrupamos los juegos por genero  --> Con repetidos, ya que algunos juegos tienen mas de una categoria.
function groupGamesByGenre(games) {
    const grouped = {};
    
    games.forEach(game => {
        if (game.genres && game.genres.length > 0) {
            
            game.genres.forEach(genre => {
                const genreName = genre.name;

                if (!grouped[genreName]) {
                    grouped[genreName] = [];
                }
                
                grouped[genreName].push(game);
            });
        }
    });
    
    return grouped;
}

//Funcion para renderizar las cards segun la cantidad de categorias.
async function renderCategories(){
    const container = document.getElementById('categoriesContainer');
    if(!container) {
        console.log('No se encontro el contenedor de categorias');
        return;
    }

    try {
        const games = await fetchGames();

        if (!games || games.length === 0) {
            container.innerHTML = '<p>No hay juegos disponibles.</p>';
            return;
        }
        const gamesByGenre = groupGamesByGenre(games);

        for(const genreName in gamesByGenre){
            if(gamesByGenre.hasOwnProperty(genreName)){
                const gamesInGenre = gamesByGenre[genreName];
                const carousel = createCarouselSection(genreName, gamesInGenre);
                container.insertAdjacentHTML('beforeend', carousel);
            }
        }

    } catch (error) {
        console.error('Error al renderizar las categorias:', error);
        container.innerHTML = '<p>Error al cargar las categorias.</p>';
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
        simulateProgress();
        loadComponent('components/header.html', 'header');
        loadComponent('components/footer.html', 'footer');
        renderCategories();
        renderRecommended();
    })