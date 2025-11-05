import {formatTime} from '../blocka/utils.js'

export class Timer{
    constructor(buttonBarContainer, time){
        this.startTime = time;
        this.buttonBarContainer = buttonBarContainer;
        this.currentTime = 0;
        this.gameTimerInterval;
    }

    //Inicia el timer.
    start(){
        this.currentTime = this.startTime;
        
        this.gameTimerInterval = setInterval(()=>{
                if(this.startTime <= 0){
                    this.currentTime++;
                }else {
                    this.currentTime--
                }
                this.buttonBarContainer.textContent = formatTime(this.currentTime);
        }, 1000);
    }

    getTime(){
        return this.currentTime;
    }

    //Detiene el timer.
    stop(){
        if(this.gameTimerInterval) clearInterval(this.gameTimerInterval);
    }
}