import { Spaceship } from "./Spaceship.js";

export class EnemyShip extends Spaceship {
    constructor(gameArea) {
        super(gameArea);
        const half = this.gameArea.clientWidth * 0.75;
        this.x = Math.floor(Math.random() * half + half - this.width);
        this.y = -this.height;
        this.element.className = 'spaceship enemyShip-down';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.gameArea.appendChild(this.element);
        this.hp = 3;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;

        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    moveShip(x, y) {
        this.x -= x;
        this.y -= y;

        this.element.style.left = this.x + 'px'
        this.element.style.top = this.y + 'px'
    }

    //Efecto de colision
    collision() {
        let animation = document.createElement('div');
        if (this.hp > 1) {
            animation.className = 'spaceship-sparks';
            this.element.appendChild(animation);
            animation.addEventListener('animationend', () => {
                animation.removeEnemyShip();
            })
        } else {
            animation.className = 'spaceship-explode';
            this.element.appendChild(animation);
            animation.addEventListener('animationend', () => {
                this.removeEnemyShip();
            })
        }
    }

    isOffScreen() {
        return this.y >= this.gameArea.clientHeight;
    }
    removeEnemyShip() {
        this.element.remove();
    }

    kill() {
        let animation = document.createElement('div');
        animation.className = 'spaceship-explode';
        this.element.appendChild(animation);
        animation.addEventListener('animationend', () => {
            this.remove();
        })
    }
}