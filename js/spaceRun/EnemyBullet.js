export class EnemyBullet {
    constructor(x, y, gameArea) {
        this.gameArea = gameArea;
        this.width = 80;
        this.height = 80;
        this.x = x;
        this.y = y;
        this.element = document.createElement('div');
        this.element.className = 'bullet enemy-bullet-move';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.gameArea.appendChild(this.element);
    }

    remove() {
        this.element.remove();
    }

    moveBullet(speed) {
        this.x -= speed;
        this.element.style.left = this.x + 'px';
    }

    isOffScreen() {
        return this.x < -this.width;
    }

    collision() {
        this.element.className = 'bullet enemy-bullet-explode';
        this.element.addEventListener('animationend', () => {
            this.remove();
        })
    }
}