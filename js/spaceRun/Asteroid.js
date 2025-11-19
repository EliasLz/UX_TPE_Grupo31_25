import { Collision } from "./Collision.js";

export class Asteroid extends Collision{
    constructor(gameArea, size, life){
        super();
        this.gameArea = gameArea;
        this.width = size;
        this.height = size;
        this.hp = life;

        this.x = this.gameArea.clientWidth;
        this.y = Math.random() * (this.gameArea.clientHeight - this.height);

        //Generamos el HTML 
        this.element = document.createElement('div');
        this.element.className = 'asteroid';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';

        //Lo añadimos al juego
        this.gameArea.appendChild(this.element);
    }

    //Restar vida.
    lossHp() {
        this.hp--;
    }

    //Avance del asteroide.
    move(speed){
        this.x -= speed;
        this.element.style.left = this.x + 'px'
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    // Método para eliminar el elemento del DOM
    remove() {
        this.element.remove();
    }

    //Efecto de colision.
    collision() {
        console.log('hola')
    }

    remove(){
        this.gameArea.removeChild(this.element);
    }
}