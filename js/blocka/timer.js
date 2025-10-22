import {formatTime} from './utils.js'
import { accommodatePice } from './puzzle.js'


export let gameTimerInterval = null; //--> Es para guardar el Id del intervalo

//Handler para el fin del juego por tiempo
export function handlerGameOver(){
    if(gameTimerInterval) clearInterval(gameTimerInterval); //--> Aca se detiene el timer
    const gameContainer = document.getElementById('gameScreen');
    const gameButtonbar = document.querySelector('.gameButtonbar');
    gameContainer.innerHTML = '<h2>¡Tiempo Agotado!</h2><p>No has completado el puzzle a tiempo.</p>'
    
    if(gameButtonbar) gameButtonbar.style.display = 'none';
}

export function startTimer(gameConfig, initialTime, timerDisplay, handlerGameOver){
    if(gameTimerInterval) clearInterval(gameTimerInterval); //--> Limpiamos el anterior tiempo (Se podria llegar a guardar para que se vea el mejor tiempo)
    const seconds = gameConfig.useHelp ? 5 : 0;

    const hintButton = document.getElementById('hint');

    const isCountdown  = gameConfig.maxTime > 0;
    let currentTime = initialTime;
    timerDisplay.textContent = formatTime(currentTime);
    
    hintButton.addEventListener('click', ()=>{
        const canHelp = accommodatePice();
        if(canHelp){  //Prevenimos que siga sumando segundos si se spamea el boton
            if(isCountdown){
                currentTime -= seconds;
            }else {
                currentTime += seconds;
            }
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

    return currentTime;
}
