import { configureGame, IMAGE_BANK } from './config.js';
import { randomOrder, formatTime } from './utils.js';
import { prepareGame } from './puzzle.js';
import { handlerGameOver, startTimer, gameTimerInterval, currentTime, totalTime, resetTotalTime } from './timer.js';



export function ejecution() {
    const currentPage = window.location.pathname.split('/').pop();

    if(currentPage != 'game2.html'){
        return;
    }

    const playButton = document.getElementById('playButton');

    playButton.addEventListener('click', async ()=>{
        //gameContainer.innerHTML = '<h2>Cargando juego...</h2>'; //TODO:: Hacer una animacion.
        playButton.style.display = 'none';
        const gameConfig = await configureGame();
        const randomImageOrder = randomOrder(IMAGE_BANK);
        let currentImageIndex = 0;

        const initialTime = gameConfig.maxTime > 0 ? gameConfig.maxTime : 0;

        function loadNextLevel() { // <-- NUEVO

            if (currentImageIndex < randomImageOrder.length) {
                // Si aún quedan imágenes en nuestro arreglo aleatorio
                const currentImage = randomImageOrder[currentImageIndex];
                
                prepareGame(gameConfig, currentImage, loadNextLevel, currentImageIndex); //--> Importante este feature de pasarle un callback
                let timerDisplay = document.getElementById('timerDisplay');


                const startTime = (currentImageIndex === 0) ? initialTime : currentTime;
                startTimer(gameConfig, startTime, timerDisplay, handlerGameOver);

                currentImageIndex++;

                let boton = document.getElementById('hint');
                if(!gameConfig.useHelp){
                    boton.style.display = 'none';
                } else {
                    boton.style.display = 'inline-block';
                }
            
            } else {
                if (gameTimerInterval) clearInterval(gameTimerInterval);
                const gameContainer = document.getElementById('gameScreen');
                let container = document.createElement('div');
                container.id = 'finalScreen';
                container.classList.add('final-screen');
                let finalMessage = '';

                if (gameConfig.maxTime > 0) {
                    // MODO CONTRARRELOJ
                    //const finalTime = formatTime(currentTime);
                    finalMessage = `<h2>¡Victoria!</h2><p>Completaste todos los puzzles en modo Contrarreloj. ¡Excelente!</p>`;
                } else {
                    // MODO CRONÓMETRO
                    //const finalTime = formatTime(currentTime);
                    finalMessage = `
                        <h2>¡Felicidades!</h2>
                        <p>Has completado todos los puzzles.</p>
                        <h4>Tu tiempo total fue de ${formatTime(totalTime)}. </h4>
                        `;

                }
                console.log('Tiempo total del juego en segundos: ' + totalTime);
                document.getElementById('timerDisplay').style.display = 'none';
                document.getElementById('miCanvas').style.display = 'none';
                container.innerHTML = finalMessage;
                container.innerHTML += `<button id="menutButton" class="btn-game">Menu Pricipal</button>`;
                gameContainer.appendChild(container);
            }

        }
        // Reinicio el tiempo total al comenzar un nuevo juego
        resetTotalTime();
        // Iniciar el primer nivel
        loadNextLevel();     
    })
}