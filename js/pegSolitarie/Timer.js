export class Timer{
    constructor(ctx){
        this.gameTimerInterval = null;
        this.ctx = ctx
        this.startTime = 120;
        this.currentTime = 0;

    }

    //Dibuja el timer.
    draw(){
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Timer: ", 10, 20);
    }

   //Inicia el timer.
   start(){
        thist.reset();
        timerDisplay.textContent = formatTime(currentTime);
        
        gameTimerInterval = setInterval(()=>{
                currentTime--;
                if(currentTime <= 0){
                    currentTime = 0;
                    clearInterval(gameTimerInterval);
                    this.gameOver();
                }
            timerDisplay.textContent = formatTime(currentTime);
            if (timerDisplay) timerDisplay.textContent = formatTime(currentTime);
        }, 1000);
    }


    //Detiene el timer.
    stop(){
        if(gameTimerInterval) clearInterval(gameTimerInterval);
    }

    //Resetea el timer.
    reset(){
        currentTime = startTime;
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) timerDisplay.textContent = formatTime(currentTime); //traer util
    }


    victoria(){
        this.stop();
        const gameContainer = document.getElementById('gameScreen');
        // Reemplaza el contenido del juego por un mensaje
        gameContainer.innerHTML = '<h2>¡VICTORIA!</h2><p>Felicitaciones has logrado superar un gran desafío.</p>';
    }


    gameOver(){
        const gameContainer = document.getElementById('gameScreen');
        // Reemplaza el contenido del juego por un mensaje
        gameContainer.innerHTML = '<h2>¡Se te agotó el tiempo!</h2><p>Suerte para la próxima.</p>';
    }
    
}