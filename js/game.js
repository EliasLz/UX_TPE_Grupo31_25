import { fetchGames } from "./fetchApi.js";

//Funcion para crear las cards de los juegos de forma dinamica.
function createGameCard(game) {
    return `
        <div class="game-card" data-game-id="${game.id}">
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

//Funcion para renderizar las cards segun la cantidad de categorias.
async function renderCategories(){
    const container = document.getElementById('conteiner-games');
    if(!container) {
        console.log('No se encontro el contenedor de juegos.');
        return;
    }

    try {
        const games = await fetchGames();

        if (!games || games.length === 0) {
            container.innerHTML = '<p>No hay juegos disponibles.</p>';
            return;
        }
        
        
        
        for(let i = 0; i < 2; i++){
            const gamesRandom = games.sort(() => 0.5 - Math.random()).slice(0, 20);
            const carousel = createCarouselSection('', gamesRandom);
            container.insertAdjacentHTML('beforeend', carousel);
            // Inicializar controles para el track recién creado
            const trackId = `carousel-random-track`;
            const trackEl = document.getElementById(trackId);
            if (trackEl) setupTrackControls(trackEl);
        }


    } catch (error) {
        console.error('Error al renderizar las categorias:', error);
        container.innerHTML = '<p>Error al cargar las categorias.</p>';
    }
}



function setupTrackControls(track) {
    // Evitar inicializar dos veces
    if (track.dataset.carouselInit === 'true') return;
    track.dataset.carouselInit = 'true';
    
    // Crear wrapper para posicionar botones
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';
    // Insertar wrapper antes del track y mover el track dentro
    track.parentNode.insertBefore(wrapper, track);
    wrapper.appendChild(track);
    
    // Crear botones
    const btnPrev = document.createElement('button');
    btnPrev.className = 'carousel-btn carousel-btn-prev';
    btnPrev.setAttribute('aria-label', 'Anterior');
    btnPrev.innerText = '<';
    
    const btnNext = document.createElement('button');
    btnNext.className = 'carousel-btn carousel-btn-next';
    btnNext.setAttribute('aria-label', 'Siguiente');
    btnNext.innerText = '>';
    
    wrapper.appendChild(btnPrev);
    wrapper.appendChild(btnNext);
    
    // Mostrar botones solo al hover del wrapper
    wrapper.classList.add('carousel-hoverable');

    // Adjuntar manejador de clicks para navegar a game.html si es id=1
    attachCardClickHandlers(track);
    
    // Manejador de desplazamiento por secciones
    const updateSize = () => {
        const card = track.querySelector('.game-card, .recommended-card');
        if (!card) {
            track._cardWidth = 200; // Valor por defecto si no hay cards
            track._visibleCount = 3;
            return;
        }
        const cardRect = card.getBoundingClientRect();
        const trackStyle = getComputedStyle(track);

        const gapValue = parseFloat(trackStyle.gap) || parseFloat(trackStyle.columnGap) || 0;
        const cardWidth = cardRect.width + gapValue;
        track._cardWidth = cardWidth;
        // calcular cuantas entran en el ancho visible del track
        const visible = Math.max(1, Math.floor(track.getBoundingClientRect().width / cardWidth));
        track._visibleCount = visible;
    };
    
    // Inicializar tamaños
    updateSize();
    window.addEventListener('resize', () => {
        updateSize();
    });
    
    // Aplica skew a todas las cards del track antes de desplazar y lo remueve después
    const applySkewToAll = (dir) => {
        const cards = Array.from(track.querySelectorAll('.game-card, .recommended-card'));
        if (!cards.length) return;

        const cls = dir === 'next' ? 'skew-x-next' : 'skew-x-prev';
        cards.forEach(c => c.classList.add(cls));

        const removeAfter = 340; // ms (debe coincidir con la transición en CSS)
        setTimeout(() => {
            cards.forEach(c => c.classList.remove(cls));
        }, removeAfter + 20);
    };

    const scrollBySection = (direction) => {
        const step = track._cardWidth * track._visibleCount;
        const newPos = track.scrollLeft + (direction === 'next' ? step : -step);
        // aplicar skew a todo el track
        applySkewToAll(direction);
        track.scrollTo({ left: newPos, behavior: 'smooth' });
    };

    btnNext.addEventListener('click', () => scrollBySection('next'));
    btnPrev.addEventListener('click', () => scrollBySection('prev'));

    
    const updateButtons = () => {
        btnPrev.disabled = track.scrollLeft <= 0 + 1;
        btnNext.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    };
    
    track.addEventListener('scroll', () => {
        updateButtons();
    });
    
    setTimeout(updateButtons, 50);
}



document.addEventListener('DOMContentLoaded', async ()=>{
    renderCategories();
})