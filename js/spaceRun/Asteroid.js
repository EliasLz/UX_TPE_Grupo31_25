import { Collision } from "./Collision.js";

export class Asteroid extends Collision{
    constructor(gameArea, sizeAsteroid, life){
        super();
        this.gameArea = gameArea;
        this.hp = life;

        this.x = this.gameArea.clientWidth;
        this.y = Math.random() * (this.gameArea.clientHeight);

        //Generamos el HTML 
        this.element = document.createElement('div');
        this.element.className = 'asteroid';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        if(sizeAsteroid == 1){
            this.element.className += ' small-asteroid';
        } else if (sizeAsteroid == 2){
            this.element.className += ' medium-asteroid';
        } else if (sizeAsteroid == 3){
            this.element.className += ' large-asteroid';
        }

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