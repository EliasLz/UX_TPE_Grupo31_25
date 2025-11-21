import { Collision } from '../Collision.js'

export class Bonus extends Collision{
    constructor(gameArea,bonus){
        super();
        this.speed = 2;
        this.bonus = bonus;
        this.gameArea = gameArea;
        this.width = 25;
        this.height = 25;

        this.x = this.gameArea.clientWidth;
        this.y = Math.random() * (this.gameArea.clientHeight - this.height);

        //Generamos el HTML 
        this.element = document.createElement('div');
        this.element.className = 'bonus';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        this.gameArea.appendChild(this.element);
    }

    remove() {
        this.element.remove();
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    move(speed){
        this.x -= speed;
        this.element.style.left = this.x + 'px'
    }

    getBonus(){
        return this.bonus;
    }

    remove(){
        this.gameArea.removeChild(this.element);
    }
}