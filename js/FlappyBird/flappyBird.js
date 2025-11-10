



export function ejecution() {
    const currentPage = window.location.pathname.split('/').pop();

    if(currentPage != 'game3.html'){
        return;
    }

    const playButton = document.getElementById('playButton');

    playButton.addEventListener('click',  ()=>{
        initGame(); // seguir por acá   
        playButton.style.display = 'none';
    });
};



//Carga recursos del juego
export async function init(){}


// prepara/primer dibujado el juego (se ejecuta una vez, cuando tiene cargado los recursos)
export function createGame(){}

// redibuja el juego en cada frame (bucle)
export function updateGame(){}