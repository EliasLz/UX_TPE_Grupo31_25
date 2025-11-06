import {formatTime} from './utils.js'
import { accommodatePice } from './puzzle.js'


export let gameTimerInterval = null; //--> Es para guardar el Id del intervalo
export let currentTime = 0;
export let totalTime = 0;

//Handler para el fin del juego por tiempo
export function handlerGameOver(){
    if(gameTimerInterval) clearInterval(gameTimerInterval); //--> Aca se detiene el timer
    const gameContainer = document.getElementById('gameScreen');
    const gameButtonbar = document.querySelector('.gameButtonbar');
    // Reemplaza el contenido del juego por un mensaje
    gameContainer.innerHTML = '<h2>¡Tiempo Agotado!</h2><p>No has completado el puzzle a tiempo.</p>'
    // Oculta la botonora (esta la cambiaría: Elías)
    if(gameButtonbar) gameButtonbar.style.display = 'none';
}


// Reset al tiempo total
export function resetTotalTime(){
    totalTime = 0;
}

export function addTotalTime(seconds){
    totalTime += seconds;
}

// Inicia el temporizador del juego
export function startTimer(gameConfig, initialTime, timerDisplay, handlerGameOver){
    
    if(gameTimerInterval) clearInterval(gameTimerInterval); //--> Limpiamos el anterior tiempo (Se podria llegar a guardar para que se vea el mejor tiempo)
    const penaltySeconds = gameConfig.useHelp ? 5 : 0;
    let currentTime = initialTime;
    const hintButton = document.getElementById('hint');
    // Determina si el temporizador es normal o a contrarreloj
    const isCountdown  = gameConfig.maxTime > 0;
    timerDisplay.textContent = formatTime(currentTime);

    hintButton.addEventListener('click', ()=>{
        const canHelp = accommodatePice();
        if(canHelp){  //Prevenimos que siga sumando segundos si se spamea el boton
            if(isCountdown){
                currentTime -= penaltySeconds;
                // Evitar tiempo negativo al descontar
                if (currentTime < 0) currentTime = 0;
            }else {
                currentTime += penaltySeconds;
            }
            timerDisplay.textContent = formatTime(currentTime);
            //Ocultar el botón después de usarlo una vez
            hintButton.style.display = 'none';
        }
    })  

    gameTimerInterval = setInterval(()=>{
        if(isCountdown){
            currentTime--;
            if(currentTime <= 0){
                currentTime = 0;
                clearInterval(gameTimerInterval);
                handlerGameOver() //--> finalizamos el juego
            }
        } else {
            currentTime++;
        }
        timerDisplay.textContent = formatTime(currentTime);
    }, 1000);



}
