export class Counter{
    constructor(ctx){
        this.ctx = ctx
        this.initialValue = 6;
        this.currentValue = 0;
        this.counterContainer = document.getElementById('counterContainer');
    }

    //Dibuja el contador.
    show(){
    const gameScreen = document.getElementById('gameScreen');
    gameScreen.innerHTML += `<div id="counterContainer">00</div>`;
    counterContainer.className ='game2Counter';    
    counterContainer.innerText = this.initialValue.toString().padStart(2, '0');
    this.currentValue = this.initialValue;
    }

    //Descuenta turno.
    discount(){
        if(this.currentValue == 0 ) return;
        this.currentValue -= 1;
        counterContainer.innerText = this.currentValue.toString().padStart(2, '0');
    }


    //Resetea el contador.
    reset(){
        counterContainer.innerText = this.initialValue.toString().padStart(2, '0');
    }
}