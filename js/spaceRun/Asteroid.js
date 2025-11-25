import { Collision } from "./Collision.js";

export class Asteroid extends Collision {
    constructor(gameArea, sizeAsteroid) {
        super();
        this.gameArea = gameArea;
        this.hp = sizeAsteroid;
        this.x = this.gameArea.clientWidth;
        this.y = Math.floor(Math.random() * ((this.gameArea.clientHeight) - 150));
        this.direction = 'right';


        //Generamos el HTML 
        this.element = document.createElement('div');
        this.element.className = 'asteroid';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';



        if (sizeAsteroid == 1) {
            this.element.className += ' small-asteroid';
            this.width = 50;
            this.height = 50;
        } else if (sizeAsteroid == 2) {
            this.element.className += ' medium-asteroid';
            this.width = 100;
            this.height = 100;
        } else if (sizeAsteroid == 3) {
            this.element.className += ' large-asteroid';
            this.width = 150;
            this.height = 150;
        }

        // hitbox ajustado
        this.hitbox = document.createElement('div');
        this.hitbox.id = 'hitbox';
        this.hitbox.style.width = (this.width - 30) + 'px';
        this.hitbox.style.height = (this.height - 30) + 'px';
        this.hitbox.style.right = '10px';
        this.hitbox.style.bottom = '10px';
        //this.hitbox.style.backgroundColor = 'green';
        this.element.appendChild(this.hitbox);

        //Lo añadimos al juego
        this.gameArea.appendChild(this.element);
    }

    //Resa vida y los elimina y reemplaza por 2 o 1 elementos con siguiente menor escala de tamaño, o solo lo elimina
    collision() {
        this.hp -= 1;

        switch (this.hp) {

            case 0:
                // Eliminammos el asteroide pequeño, no devuelve fragmentos
                this.element.className = 'asteroid small-asteroid-destroy';
                this.element.addEventListener('animationend', () => {
                    this.remove();
                })
                return null;

            case 1:
                // Creamos fragmentos asteroides
                const fragmentedAsteroid = new Asteroid(this.gameArea, 1);
                // Reasignamos su posicion
                fragmentedAsteroid.setX(this.x);
                fragmentedAsteroid.setY(this.y);
                // Modificamos su direccion
                fragmentedAsteroid.setDirection('slowed');
                // Eliminamos asteroide origen con animacion
                this.element.className = 'asteroid medium-asteroid-destroy';
                this.element.addEventListener('animationend', () => {
                    this.remove();
                })
                // Retornamos el nuevo asteroide para que Space lo agregue a su arreglo de asteroides
                const fragment = [fragmentedAsteroid];
                return fragment;

            case 2:
                // Creamos fragmentos asteroides
                const fragmentedAsteroid1 = new Asteroid(this.gameArea, 2);
                const fragmentedAsteroid2 = new Asteroid(this.gameArea, 2);
                const fragmentedAsteroid3 = new Asteroid(this.gameArea, 1);

                // Reasignamos sus posiciones
                fragmentedAsteroid1.setX(this.x - 50);
                fragmentedAsteroid1.setY(this.y - 35);
                fragmentedAsteroid2.setX(this.x - 50);
                fragmentedAsteroid2.setY(this.y + 85);
                fragmentedAsteroid3.setX(this.x + 50);

                // Modificamos sus direcciones
                fragmentedAsteroid1.setDirection('diagonalUp');
                fragmentedAsteroid2.setDirection('diagonalDown');
                fragmentedAsteroid3.setDirection('slowed');
                // Eliminamos asteroide origen con animacion
                this.element.className = 'asteroid large-asteroid-destroy';
                this.element.addEventListener('animationend', () => {
                    this.remove();
                })
                // Retornamos los nuevos asteroides para que Space los agregue a su arreglo de asteroides
                const fragments = [fragmentedAsteroid1, fragmentedAsteroid2, fragmentedAsteroid3];
                return fragments;
        }
    }

    //Avance del asteroide.
    move(x, y) {
        this.x -= x;
        this.element.style.left = this.x + 'px'
        this.y -= y;
        this.element.style.top = this.y + 'px'
    }

    isOffScreen() {
        return this.x + this.width < 0 ||
            this.y + this.height < 0 ||
            this.y > this.gameArea.clientHeight;
    }

    // Método para eliminar el elemento del DOM
    remove() {
        this.element.remove();
    }

    setX(valorX) {
        this.x = valorX;
        this.element.style.left = this.x + 'px';
    }

    setY(valorY) {
        this.y = valorY;
        this.element.style.top = this.y + 'px';

    }

    setDirection(direction) {
        const validDirections = ['right', 'diagonalUp', 'diagonalDown', 'slowed', 'static'];
        if (validDirections.includes(direction)) {
            this.direction = direction;
        }
    }
}