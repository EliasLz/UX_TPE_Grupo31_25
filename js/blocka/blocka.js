import { configureGame, IMAGE_BANK } from './config.js';
import { randomOrder, formatTime } from './utils.js';
import { prepareGame } from './puzzle.js';
import { handlerGameOver, startTimer, gameTimerInterval, currentTime } from './timer.js';

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

        const gameButtonbar = document.getElementById('gameScreen');

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
                    console.log( boton);
                    boton.style.display = 'none';
                } else {
                    boton.style.display = 'inline-block';
                }
            
            } else {
                if (gameTimerInterval) clearInterval(gameTimerInterval);
                const gameContainer = document.getElementById('gameScreen');
                let finalMessage = '';

                if (gameConfig.maxTime > 0) {
                    // MODO CONTRARRELOJ
                    const finalTime = formatTime(currentTime);
                    finalMessage = `<h2>¡Victoria!</h2><p>Completaste todos los puzzles en modo Contrarreloj con ${finalTime} de tiempo consumido. ¡Excelente!</p>`;
                } else {
                    // MODO CRONÓMETRO
                    const finalTime = formatTime(currentTime);
                    finalMessage = `<h2>¡Felicidades!</h2><p>Has completado todos los puzzles. Tu tiempo total fue de ${finalTime}.</p>`;
                }

                gameContainer.innerHTML = finalMessage;
                gameButtonbar.style.display = 'none';
            }

        }
        // Iniciar el primer nivel
        loadNextLevel();     
    })
}