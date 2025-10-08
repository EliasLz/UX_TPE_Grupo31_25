import { fetchGames } from "./fetchApi.js";
import {simulateProgress} from "./spiner.js";
import { mainHamburguer } from "./menu.js";

// Función para cargar un componente dinámicamente.
export function loadComponent(urlComponent, idDestination) {
    // Devolver la promise para permitir esperar la carga desde quien llame
    return fetch(urlComponent) //--> Ruta del componente que queremos cargar
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

function createRecommendedCard(game) {
    return `
        <div class="recommended-card" data-game-id="${game.id}">
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

//Funcion para seleccionar los juegos recomendados.
function selectRecommendedGames(games) {
    let recommendedList = [];
    
    const pegSolitarie = games.find(game => game.id === 1); //--> Aseguramos que el Peg Solitarie este siempre.
    
    if (pegSolitarie) {
        recommendedList.push(pegSolitarie);
    }

    const candidates = games.filter(game => 
        game.rating > 4.3 && game.id !== 1
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
        
        // Seleccionamos los 3 juegos recomendados.
        const recommendedGames = selectRecommendedGames(games);

        if (recommendedGames.length === 0) {
            container.innerHTML = '<p>No hay juegos recomendados.</p>';
            return;
        }

        recommendedGames.forEach(game => {
            const cardHTML = createRecommendedCard(game);
            container.insertAdjacentHTML('beforeend', cardHTML);
        });

    initCarousel(container);
    attachCardClickHandlers(container);

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
                // Inicializar controles para el track recién creado
                const trackId = `carousel-${genreName.replace(/\s/g, '-')}-track`;
                const trackEl = document.getElementById(trackId);
                if (trackEl) setupTrackControls(trackEl);
            }
        }

    } catch (error) {
        console.error('Error al renderizar las categorias:', error);
        container.innerHTML = '<p>Error al cargar las categorias.</p>';
    }
}


// Inicializa los controles de carrusel para un contenedor de track
function initCarousel(rootContainer) {
    // Selecciona tracks dentro del root (si es el recommendedContainer el track son las .recommended-card dentro)
    // Para compatibilidad, soportamos contenedores que tienen children .recommended-card o .game-card
    const track = rootContainer.classList.contains('card-container') ? rootContainer : null;
    
    // Si es recommended (card-container)
    if (track) {
        setupTrackControls(track);
    }
    
    // También inicializar todos los carousel-track generados en las categorias
    const otherTracks = document.querySelectorAll('.carousel-track');
    otherTracks.forEach(t => setupTrackControls(t));
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

// Detectar clicks en .game-card o .recommended-card
function attachCardClickHandlers(container) {
    if (!container) return;
    // Evitar adjuntar múltiples veces
    if (container.dataset.cardHandler === 'true') return;
    container.dataset.cardHandler = 'true';

    container.addEventListener('click', (e) => {
        // Buscamos data-game-id
        let el = e.target;
        while (el && el !== container) {
            if (el.dataset && el.dataset.gameId) {
                const id = el.dataset.gameId;
                if (id === '1' || id === 1) {
                    window.location.href = 'game.html';
                }
                return;
            }
            el = el.parentNode;
        }
    });
}


// Inicializa auto-scroll infinito para los anuncios
function initAdsAutoScroll() {
    const container = document.querySelector('.ads-card-container');
    if (!container) return;
    if (container.dataset.infiniteInit === 'true') return;
    container.dataset.infiniteInit = 'true';

    container.style.overflow = 'hidden';
    
    // Crear wrapper interno y mover los items ahí
    const items = Array.from(container.children);
    if (items.length === 0) return;
    
    const inner = document.createElement('div');
    inner.className = 'ads-auto-wrap';
    inner.style.display = 'flex';
    inner.style.alignItems = 'stretch';
    inner.style.willChange = 'transform';
    inner.style.flexWrap = 'nowrap';
    inner.style.gap = getComputedStyle(container).gap || '';
    
    
    // Mover items dentro de inner (guardamos referencia a los originales)
    const originalItems = [];
    items.forEach(item => {
        originalItems.push(item);
        inner.appendChild(item);
    });
    
    // Clonar individualmente los items y añadirlos al final para crear el loop
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        inner.appendChild(clone);
    });
    
    // Vaciar container y añadir inner
    container.appendChild(inner);
    
    // Esperar a que las imágenes del contenedor se carguen para calcular anchos
    const imgs = Array.from(inner.querySelectorAll('img'));
    const waitForImages = () => Promise.all(imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => { img.addEventListener('load', resolve); img.addEventListener('error', resolve); });
    }));

    let paused = false;
    let rafId = null;
    let last = performance.now();
    let speed = 0.06;
    let widthFirstSet = 0;
    
    const start = async () => {
        await waitForImages();
        widthFirstSet = 0;
        widthFirstSet = originalItems.reduce((sum, it) => sum + it.getBoundingClientRect().width + (parseFloat(getComputedStyle(it).marginRight) || 0), 0);
        if (!widthFirstSet) {
            widthFirstSet = inner.getBoundingClientRect().width / 2;
        }
        
        // Animación por transform
        last = performance.now();
        let translate = 0;
        
        function loop(now) {
            const delta = now - last;
            last = now;
            if (!paused) {
                translate -= speed * delta; // mover hacia la izquierda
                if (-translate >= widthFirstSet) {
                    // reset al inicio
                    translate += widthFirstSet;
                }
                inner.style.transform = `translate3d(${translate}px,0,0)`;
            }
            rafId = requestAnimationFrame(loop);
        }
        
        rafId = requestAnimationFrame(loop);
    };
    
    start();
    
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    
    // Pausar solo si el puntero está sobre una card
    container.addEventListener('mouseover', (e) => {
        if (e.target.closest('.ads-card')) pause();
    });
    container.addEventListener('mouseout', (e) => {
        if (e.target.closest('.ads-card')) resume();
    });
    
    // También pausar en interacción táctil/scroll del usuario
    container.addEventListener('pointerdown', pause, {passive:true});
    window.addEventListener('pointerup', resume);
    container.addEventListener('wheel', pause, {passive:true});
    container.addEventListener('touchstart', pause, {passive:true});
    container.addEventListener('touchend', resume, {passive:true});
    
    // Recalcular ancho en resize
    window.addEventListener('resize', () => {
        const children = Array.from(inner.children);
        if (children.length === 2) {
            widthFirstSet = children[0].getBoundingClientRect().width;
        } else {
            widthFirstSet = inner.getBoundingClientRect().width / 2;
        }
    });
    
    // Pausar cuando la ventana pierde foco
    window.addEventListener('blur', pause);
    window.addEventListener('focus', resume);
}

// usamos timeout corto para dar tiempo a que el DOM esté completamente renderizado
setTimeout(() => initAdsAutoScroll(), 200);

document.addEventListener('DOMContentLoaded', async ()=>{
        simulateProgress();
        await loadComponent('components/header.html', 'header');
        await loadComponent('components/footer.html', 'footer');
        renderCategories();
        renderRecommended();
        mainHamburguer();
    })