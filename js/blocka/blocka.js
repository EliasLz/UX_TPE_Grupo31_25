import { configureGame, IMAGE_BANK } from './config.js';
import { randomOrder, formatTime } from './utils.js';
import { prepareGame } from './puzzle.js';
import { handlerGameOver, startTimer, gameTimerInterval } from './timer.js';

let currentTime = 0;

export function ejecution() {
    const playButton = document.getElementById('playButton');

    playButton.addEventListener('click', async ()=>{
        //gameContainer.innerHTML = '<h2>Cargando juego...</h2>'; //TODO:: Hacer una animacion.
        playButton.style.display = 'none';
        const gameConfig = await configureGame();
        const randomImageOrder = randomOrder(IMAGE_BANK);
        let currentImageIndex = 0;

        const gameButtonbar = document.getElementById('gameScreen');
        const firsChild = gameButtonbar.firstElementChild;
        let timerDisplay = document.getElementById('timerDisplay');
        console.log(gameButtonbar);
        console.log(document);
        console.log(timerDisplay);

        if (!timerDisplay) { // Crear si no existe.
            timerDisplay = document.createElement('div')
            timerDisplay.id = 'timerDisplay';
            timerDisplay.classList.add('timerDisplay');
            firsChild.insertAdjacentElement('afterend', timerDisplay)
        }
        timerDisplay.textContent = '00:00'


        function loadNextLevel() { // <-- NUEVO
            if (currentImageIndex < randomImageOrder.length) {
                // Si aún quedan imágenes en nuestro arreglo aleatorio
                const currentImage = randomImageOrder[currentImageIndex];
                
                prepareGame(gameConfig, currentImage, loadNextLevel, currentImageIndex); //--> Importante este feature de pasarle un callback
                
                currentImageIndex++;
            
            } else {
                if (gameTimerInterval) clearInterval(gameTimerInterval);
                const gameContainer = document.getElementById('gameScreen');
                let finalMessage = '';

                if (gameConfig.maxTime > 0) {
                    // MODO CONTRARRELOJ
                    const timeSpent = gameConfig.maxTime - currentTime;
                    const finalTime = formatTime(timeSpent);
                    finalMessage = `<h2>¡Victoria!</h2><p>Completaste todos los puzzles en modo Contrarreloj con **${finalTime}** de tiempo consumido. ¡Excelente!</p>`;
                } else {
                    // MODO CRONÓMETRO
                    const finalTime = formatTime(currentTime);
                    finalMessage = `<h2>¡Felicidades!</h2><p>Has completado todos los puzzles. Tu tiempo total fue de **${finalTime}**.</p>`;
                }

                gameContainer.innerHTML = finalMessage;
                gameButtonbar.style.display = 'none';
            }
        }

        const initialTime = gameConfig.maxTime > 0 ? gameConfig.maxTime : 0;
        
        //Guardamos el tiempo actual
        currentTime = startTimer(gameConfig, initialTime, timerDisplay, handlerGameOver);
        
        // Iniciar el primer nivel
        loadNextLevel();     
    })
}