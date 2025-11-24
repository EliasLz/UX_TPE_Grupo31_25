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
            this.width = 50;
            this.height = 50;
        } else if (sizeAsteroid == 2){
            this.element.className += ' medium-asteroid';
            this.width = 100;
            this.height = 100;
        } else if (sizeAsteroid == 3){
            this.element.className += ' large-asteroid';
            this.width = 150;
            this.height = 150;
        }
        
        // hitbox ajustado
        this.hitbox = document.createElement('div');
        this.hitbox.id = 'hitbox';
        this.hitbox.style.width = (this.width - 30) + 'px';
        this.hitbox.style.height = (this.height -30 ) + 'px';
        this.hitbox.style.right = '10px';
        this.hitbox.style.bottom = '10px';
        this.element.appendChild(this.hitbox);

        //Lo añadimos al juego
        this.gameArea.appendChild(this.element);
    }

    //Restar vida.
    lossHp() {
        this.hp-=2;
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
    }
}