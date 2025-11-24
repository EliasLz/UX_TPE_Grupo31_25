import { Asteroid } from './Asteroid.js';
import { Bullet } from './Bullet.js';
import { Life } from './Bonus/Life.js';
import { Weapon } from './Bonus/Weapon.js';
import { Spaceship } from './Spaceship.js';

export class Space {
    constructor(gameContainer) {
        this.gameArea = gameContainer;
        this.gameSpeed = 1; //--> Velocidad del scroll.

        this.arrAsteroids = [];
        this.arrBonus = [];
        this.arrBullets = [];

        //Instanciamos la nave
        this.spaceship = new Spaceship(this.gameArea);

        //Temporizador para la creacion de objetos.
        this.astSpawnTimer = 0;
        this.astSpawnInterval = 100;

        this.bonSpawnTimer = 0;
        this.bonSpawnInterval = 500;

        // Hud Elements
        this.hudLife = document.createElement('div');
        this.hudLife.className = 'hud-life';
        this.framesLife = 8;
        this.widthLifeFrame = 106;


        this.hudAmmunition = document.createElement('div');
        this.hudAmmunition.className = 'hud-ammunition';
        this.hudAmmunition.style.top = '50px';

        this.hudAmmunition2 = document.createElement('div');
        this.hudAmmunition2.className = 'hud-ammunition';
        this.hudAmmunition2.style.top = '80px';

        this.framesBullet = 7;
        this.widthBulletFrame = 87;

        this.hudScore = document.createElement('div');
        this.hudScore.className = 'hud-score';

        this.currentScore = 0;
        this.scoreText = document.createElement('p');
        this.scoreText.textContent = `Puntaje: ${this.currentScore}`;
        this.hudScore.appendChild(this.scoreText);

        this.gameArea.appendChild(this.hudLife);
        this.gameArea.appendChild(this.hudAmmunition);
        this.gameArea.appendChild(this.hudAmmunition2);
        this.gameArea.appendChild(this.hudScore);

        this.scoreFrameCounter = 0;
    }

    update() {
        for (let i = this.arrAsteroids.length - 1; i >= 0; i--) {
            let ast = this.arrAsteroids[i];
            ast.move(this.gameSpeed);

            if (ast.isOffScreen()) {
                ast.remove();
                this.arrAsteroids.splice(i, 1)
            }
        }

        for (let i = this.arrBonus.length - 1; i >= 0; i--) {
            let bon = this.arrBonus[i];
            bon.move(this.gameSpeed);

            if (bon.isOffScreen()) {
                bon.remove();
                this.arrBonus.splice(i, 1)
            }
        }

        for (let i = this.arrBullets.length - 1; i >= 0; i--) {
            let bull = this.arrBullets[i];
            bull.move(2);

            if (bull.isOffScreen()) {
                bull.remove();
                this.arrBullets.splice(i, 1)
            }
        }

        this.astSpawnTimer++;
        this.bonSpawnTimer++;
        this.scoreFrameCounter++;

        if (this.astSpawnTimer >= this.astSpawnInterval) {
            this.addAsteroid()
            if (this.astSpawnInterval > 10) { //-->Aparecen ams rapido con el tiempo.
                this.astSpawnInterval -= 0.5;
            }
            this.astSpawnTimer = 0;
        }

        if (this.bonSpawnTimer >= this.bonSpawnInterval) {
            this.addBonus()
            if (this.bonSpawnInterval < 5000) { //-->Aparecen ams rapido con el tiempo.
                this.bonSpawnInterval += 0.5;
            }
            this.bonSpawnTimer = 0;
        }

        if (this.scoreFrameCounter >= 24) {
            this.upDateScoreHud(1);
            this.scoreFrameCounter = 0;
        }

        this.gameSpeed += 0.0003;

        //Chequeo si la nave toco fondo
        if (this.spaceship.y >= this.gameArea.clientHeight - this.spaceship.height) {
            this.spaceship.hp = 1;
            this.lifeHud();
            this.spaceship.collision();
            return true;
        }
    }

    // Hay/Existe una colision
    checkCollisions() {
        const spaceshipRec = this.spaceship.element.getBoundingClientRect();

        for (let i = this.arrAsteroids.length - 1; i >= 0; i--) {
            const ast = this.arrAsteroids[i];
            const astRect = ast.hitbox.getBoundingClientRect();

            if (this.isColliding(spaceshipRec, astRect)) {
                this.spaceship.lossHp();
                this.lifeHud();
                this.spaceship.collision();
                ast.remove();
                this.arrAsteroids.splice(i, 1);
            }
        }

        for (let j = this.arrBullets.length - 1; j >= 0; j--) {
            const bull = this.arrBullets[j];
            const bullRect = bull.element.getBoundingClientRect();

            // Ahora iteramos sobre los asteroides usando 'i'
            for (let i = this.arrAsteroids.length - 1; i >= 0; i--) {
                const ast = this.arrAsteroids[i];
                const astRect = ast.hitbox.getBoundingClientRect();

                if (this.isColliding(astRect, bullRect)) {

                    if (ast.hp > 1) {
                        ast.lossHp();
                    } else {
                        this.upDateScoreHud(150);
                        ast.remove();
                        this.arrAsteroids.splice(i, 1);
                    }
                    bull.collision();
                    this.arrBullets.splice(j, 1);
                }
            }
        }

        for (let i = this.arrBonus.length - 1; i >= 0; i--) {
            const bon = this.arrBonus[i];
            const bonRect = bon.element.getBoundingClientRect();

            if (this.isColliding(spaceshipRec, bonRect)) {
                this.upDateScoreHud(50);
                if (bon instanceof Life) {
                    if (this.spaceship.hp < 8) {
                        this.spaceship.addHp();
                        this.lifeHud();
                    }
                } else {
                    if (this.spaceship.ammunition < 12) {
                        this.spaceship.enableShooting();
                        this.spaceship.addAmmunition(bon.getBonus());
                        this.ammunitiontHud();
                    }
                }
                bon.remove();
                this.arrBonus.splice(i, 1);
            }
        }

        return;
    }

    //Funcion auxiliar de checkCollisions.
    isColliding(rect1, rect2) {
        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }

    //Agregamos Asteroides al juego.
    addAsteroid() {
        const size = Math.floor(Math.random() * 3) + 1;

        // Esta fórmula mapea el rango [30, 100] a el rango [1, 7]
        const life = size * 3;

        let asteroid = new Asteroid(this.gameArea, size, life);
        //aseguramos que no colisione al crearlo
        if (this.arrAsteroids.length > 0) {
            while (this.isColliding(this.arrAsteroids.at(-1).element.getBoundingClientRect(), asteroid.element.getBoundingClientRect())) {
                asteroid = new Asteroid(this.gameArea, size, life);
            }
        }
        this.arrAsteroids.push(asteroid);
    }

    //Agregamos la bala al juego.
    addBullet() {
        const x = this.spaceship.x + this.spaceship.width;
        const y = this.spaceship.y + (this.spaceship.height / 2) - 2.5;

        const bullet = new Bullet(x, y, this.gameArea);
        this.arrBullets.push(bullet);
    }

    //Agregamos Bonus al juego.
    addBonus() {
        let rndSpawn = Math.floor(Math.random() * 10);

        if (rndSpawn > 3) {
            let bonus = new Weapon(this.gameArea, 5);
            //aseguramos que no colisione al crearlo
            while (this.isColliding(this.arrAsteroids.at(-1).element.getBoundingClientRect(), bonus.element.getBoundingClientRect())) {
                bonus = new Weapon(this.gameArea, 5);
            }
            this.arrBonus.push(bonus);
        } else {
            let bonus = new Life(this.gameArea, 1);
            //aseguramos que no colisione al crearlo
            while (this.isColliding(this.arrAsteroids.at(-1).element.getBoundingClientRect(), bonus.element.getBoundingClientRect())) {
                bonus = new Life(this.gameArea, 1);
            }
            this.arrBonus.push(bonus);
        }
    }

    //Movimientos de la nave.
    spaceshipMoveUp() {
        this.spaceship.upMove();
    }
    spaceshipMoveDown() {
        this.spaceship.downMove();
    }

    //Disparo de la nave.
    spaceshipShoot() {
        if (this.spaceship.isEnabled && this.spaceship.ammunition > 0) {
            this.addBullet()
            this.spaceship.shooting();
            this.ammunitiontHud();
        }
    }

    lifeHud() {
        let positionX = -(this.widthLifeFrame * (this.framesLife - this.spaceship.hp));
        this.hudLife.style.backgroundPosition = `${positionX}px 0px`;
    }

    ammunitiontHud() {
        if (this.spaceship.ammunition <= 5) {
            let positionX = -(this.widthBulletFrame * ((this.framesBullet - 1) - this.spaceship.ammunition));
            this.hudAmmunition.style.backgroundPosition = `${positionX}px 0px`;
        } else {
            this.hudAmmunition.style.backgroundPosition = `0px 0px`;
            let positionX = -(this.widthBulletFrame * (((this.framesBullet - 1) * 2) - this.spaceship.ammunition));
            this.hudAmmunition2.style.backgroundPosition = `${positionX}px 0px`;
        }
    }

    upDateScoreHud(suma) {
        this.currentScore += suma;
        this.scoreText.textContent = `Puntaje: ${this.currentScore}`;
    }

    //eliminar todos los elementos del juego
    destroy() {
        this.arrAsteroids.forEach(ast => ast.remove());
        this.arrBonus.forEach(bon => bon.remove());
        this.arrBullets.forEach(bull => bull.remove());
        this.hudLife.remove();
        this.hudAmmunition.remove();
        this.hudAmmunition2.remove();
        this.hudScore.remove();
    }

}