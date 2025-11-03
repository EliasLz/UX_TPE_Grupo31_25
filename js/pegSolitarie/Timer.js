export class Timer{
    constructor(ctx){
        this.ctx = ctx
        this.startTime = 0;
    }

    //Dibuja el timer.
    draw(){
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Timer: ", 10, 20);
    }

    //Inicia el timer.
    start(){

    }

    //Detiene el timer.
    stop(){

    }

    //Resetea el timer.
    reset(){

    }
}