import { Collision } from "./Collision.js";

export class Bullet extends Collision{
    constructor(x,y,gameArea){
        super();
        this.gameArea = gameArea;

        this.width = 5;
        this.height = 5;

        this.x = x;
        this.y = y;

        //Generamos el HTML de la nave 
        this.element = document.createElement('div');
        this.element.className = 'bullet bullet-move';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        this.gameArea.appendChild(this.element);
    }

    remove(){
        this.element.remove();
    }

    move(speed){
        this.x += speed;
        this.element.style.left = this.x + 'px';
    }

    isOffScreen() {
        return this.x > this.gameArea.clientWidth;
    }

    collision(){
        this.element.className = 'bullet bullet-explode';
        this.element.addEventListener('animationend' , ()=>{
            this.remove();
        })
    }
}