import {formatTime} from './utils.js'

export let gameTimerInterval = null; //--> Es para guardar el Id del intervalo

//Handler para el fin del juego por tiempo
export function handlerGameOver(){
    if(gameTimerInterval) clearInterval(gameTimerInterval); //--> Aca se detiene el timer
    const gameContainer = document.getElementById('gameScreen');
    const gameButtonbar = document.querySelector('.gameButtonbar');
    gameContainer.innerHTML = '<h2>¡Tiempo Agotado!</h2><p>No has completado el puzzle a tiempo.</p>'
    
    if(gameButtonbar) gameButtonbar.style.display = 'none';
}

export function startTimer(gameConfig, initialTime, timer, handlerGameOver){
    if(gameTimerInterval) clearInterval(gameTimerInterval); //--> Limpiamos el anterior tiempo (Se podria llegar a guardar para que se vea el mejor tiempo)
    
    const isCountdown  = gameConfig.maxTime > 0;
    let currentTime = initialTime;
    timer.textContent = formatTime(currentTime);
    
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
        timer.textContent = formatTime(currentTime);
    }, 1000); 

    return currentTime;
}
