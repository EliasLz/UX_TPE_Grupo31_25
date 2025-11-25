import { Asteroid } from './Asteroid.js';
import { Bullet } from './Bullet.js';
import { Life } from './Bonus/Life.js';
import { Weapon } from './Bonus/Weapon.js';
import { Spaceship } from './Spaceship.js';
import { EnemyShip } from './EnemyShip.js';
import { EnemyBullet } from './EnemyBullet.js';


export class Space {
    constructor(gameContainer) {
        this.gameArea = gameContainer;
        this.gameSpeed = 1; //--> Velocidad del scroll.

        this.arrAsteroids = [];
        this.arrBonus = [];
        this.arrBullets = [];
        this.arrEnemyBullets = [];
        this.enemyShip = null;

        //Instanciamos la nave
        this.spaceship = new Spaceship(this.gameArea);

        //Temporizador para la creacion de asteroides
        this.astSpawnTimer = 0;
        this.astSpawnInterval = 100;

        //Temporizador para la creacion de items bonificadores
        this.bonSpawnTimer = 0;
        this.bonSpawnInterval = 500;

        //Temporizador para la creacion de nave enemiga y su disparo
        this.enemyShipSpawnTimer = 0;
        this.enemyShipSpawnInterval = 1000;
        this.enemyShootingTimer = 0;
        this.enemyShootingInterval = 170;

        //Temporizador puntos por supervivencia
        this.scoreTimer = 0;
        this.scorePointInterval = 24;

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
    }

    update() {
        /* ---- Movemos los elementos del nivel y los eliminamos cuando salen de pantalla  ----*/

        // Asteroides    
        for (let i = this.arrAsteroids.length - 1; i >= 0; i--) {
            let ast = this.arrAsteroids[i];

            switch (ast.direction) {
                case 'right':
                    ast.move(this.gameSpeed, 0);
                    break;
                case 'diagonalUp':
                    ast.move(this.gameSpeed, (this.gameSpeed * 0.25));
                    break;
                case 'diagonalDown':
                    ast.move(this.gameSpeed, (this.gameSpeed * -0.25));
                    break;
                case 'slowed':
                    ast.move(this.gameSpeed * 0.65, 0);
                    break;
                case 'static':
                    break;
            }

            if (ast.isOffScreen()) {
                ast.remove();
                this.arrAsteroids.splice(i, 1)
            }
        }

        // Items bonificadores    
        for (let i = this.arrBonus.length - 1; i >= 0; i--) {
            let bon = this.arrBonus[i];
            bon.move(this.gameSpeed);

            if (bon.isOffScreen()) {
                bon.remove();
                this.arrBonus.splice(i, 1)
            }
        }

        // Balas player
        for (let i = this.arrBullets.length - 1; i >= 0; i--) {
            let bull = this.arrBullets[i];
            bull.move(6);

            if (bull.isOffScreen()) {
                bull.remove();
                this.arrBullets.splice(i, 1)
            }
        }

        // Nave enemiga: Movimiento - disparo - elimina si se sale de pantalla
        this.enemyShootingTimer++;
        if (this.enemyShip != null) {
            this.enemyShip.moveShip(this.gameSpeed, (Math.floor(this.gameSpeed * -0.25)));

            if (this.enemyShootingTimer >= this.enemyShootingInterval) {
                this.addEnemyBullet();
                this.enemyShootingTimer = 0;
            }

            if (this.enemyShip.isOffScreen()) {
                this.enemyShip.removeEnemyShip();
                this.enemyShip = null;
            }
        }

        // Balas nave enemiga
        if (this.arrEnemyBullets.length > 0) {
            for (let i = this.arrEnemyBullets.length - 1; i >= 0; i--) {
                let enemyBull = this.arrEnemyBullets[i];
                enemyBull.moveBullet(3);

                if (enemyBull.isOffScreen()) {
                    enemyBull.remove();
                    this.arrEnemyBullets.splice(i, 1)
                }
            }
        }
        // Aceleracion del movimiento de los elementos 
        this.gameSpeed += 0.0008;

        /* --- Aparicion de nuevos elementos del nivel ---*/

        this.astSpawnTimer++;
        this.bonSpawnTimer++;
        this.enemyShipSpawnTimer++;

        if (this.astSpawnTimer >= this.astSpawnInterval) {
            this.addAsteroid()
            if (this.astSpawnInterval > 20) { //-->Aparecen mas rapido con el tiempo.
                this.astSpawnInterval -= 0.5;
            }
            this.astSpawnTimer = 0;
        }

        if (this.bonSpawnTimer >= this.bonSpawnInterval) {
            this.addBonus()
            if (this.bonSpawnInterval < 2000) { //-->Aparecen mas lento con el tiempo.
                this.bonSpawnInterval += 1;
            }
            this.bonSpawnTimer = 0;
        }

        if (!this.enemyShip && this.enemyShipSpawnTimer >= this.enemyShipSpawnInterval) {
            this.enemyShip = new EnemyShip(this.gameArea);
            if (this.enemyShipSpawnInterval > 600) { //-->Aparecen mas rapido con el tiempo.
                this.enemyShipSpawnInterval -= 100;
            }
            this.enemyShipSpawnTimer = 0;
        }

        // Aumentos el puntaje del jugador: +1 punto cada 24 frames
        this.scoreTimer++;

        if (this.scoreTimer >= this.scorePointInterval) {
            this.upDateScoreHud(1);
            this.scoreTimer = 0;
        }

        //Chequeamos si la nave toco fondo
        if (this.spaceship.y >= this.gameArea.clientHeight - this.spaceship.height) {
            this.spaceship.hp = 1;
            this.lifeHud();
            this.spaceship.collision();
            return true;
        }
    }

    /*--- Hay/Existe una colision ---*/
    checkCollisions() {
        const spaceshipRec = this.spaceship.element.getBoundingClientRect();

        // Chequeamos colision nave con asteroides
        for (let i = this.arrAsteroids.length - 1; i >= 0; i--) {
            const ast = this.arrAsteroids[i];
            const astRect = ast.hitbox.getBoundingClientRect();

            if (this.isColliding(spaceshipRec, astRect)) {
                this.spaceship.lossHp();
                this.lifeHud();
                this.spaceship.collision();
                //Si se divide en fragmentos al perder salud, agregamos los nuevos asteroides al arreglo
                let asteroidFragments;
                if ((asteroidFragments = ast.collision())) {
                    asteroidFragments.forEach(asteroidFragment => {
                        this.arrAsteroids.push(asteroidFragment);
                    });
                }
                // Eliminamos del arreglo al asteroide original
                this.arrAsteroids.splice(i, 1);
                break;
            }
        }

        // Chequeamos colision asteriodes con balas
        for (let j = this.arrBullets.length - 1; j >= 0; j--) {
            const bull = this.arrBullets[j];
            const bullRect = bull.element.getBoundingClientRect();

            // Ahora iteramos sobre los asteroides usando 'i'
            for (let i = this.arrAsteroids.length - 1; i >= 0; i--) {
                const ast = this.arrAsteroids[i];
                const astRect = ast.hitbox.getBoundingClientRect();

                if (this.isColliding(astRect, bullRect)) {

                    let asteroidFragments;
                    // Si se divide en fragmentos al perder salud, agregamos los nuevos asteroides al arreglo
                    if ((asteroidFragments = ast.collision())) {
                        asteroidFragments.forEach(asteroidFragment => {
                            this.arrAsteroids.push(asteroidFragment);
                        });
                    }
                    this.upDateScoreHud(150);
                    // Eliminamos del arreglo al asteroide original
                    this.arrAsteroids.splice(i, 1);
                    bull.collision();
                    this.arrBullets.splice(j, 1);
                    break;
                }
            }
        }

        // Chequeamos colision balas con nave enemiga
        if (this.arrBullets.length > 0 && this.enemyShip != null) {
            for (let i = this.arrBullets.length - 1; i >= 0; i--) {
                const bull = this.arrBullets[i];
                const bullRect = bull.element.getBoundingClientRect();
                const enemyShipRect = this.enemyShip.element.getBoundingClientRect();
                if (this.isColliding(bullRect, enemyShipRect)) {
                    this.enemyShip.kill();
                    this.upDateScoreHud(500);
                    this.enemyShip = null;
                    bull.collision();
                    this.arrBullets.splice(i, 1);
                    break;
                }
            }
        }

        // Chequeamos colision nave con items bonus
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
                break;
            }
        }

        // Chequeamos colisiones de asteroidoes con asteroides
        let astsToRemove = [];
        for (let j = this.arrAsteroids.length - 1; j >= 0; j--) {
            const astJ = this.arrAsteroids[j];
            const astJRect = astJ.element.getBoundingClientRect();

            for (let i = this.arrAsteroids.length - 1; i >= 0; i--) {
                const astI = this.arrAsteroids[i];
                const astIRect = astI.hitbox.getBoundingClientRect();
                if (i === j) {
                    continue;
                }
                if (this.isColliding(astJRect, astIRect)) {

                    let asteroidJFragments;
                    if ((asteroidJFragments = astJ.collision())) {
                        asteroidJFragments.forEach(asteroidJFragment => {
                            this.arrAsteroids.push(asteroidJFragment);
                        });
                    }
                    let asteroidIFragments;
                    if ((asteroidIFragments = astI.collision())) {
                        asteroidIFragments.forEach(asteroidIFragment => {
                            this.arrAsteroids.push(asteroidIFragment);
                        });
                    }
                    // Agregamos el index de los asteroides a eliminar luego de finalizar las iteraciones
                    astsToRemove.push(j);
                    astsToRemove.push(i);
                    break;
                }
            }
        }
        // Finilizada las detecciones entre asteroides eliminamos todos los que están en colision
        if (astsToRemove.length > 0) {
            // Ordenamos los indices de mayor a menor
            astsToRemove.sort((a, b) => b - a);
            // Eliminamos indices repetidos
            astsToRemove = new Set(astsToRemove);
            // Eliminamos del arreglo segun los indices de la coleccion
            astsToRemove.forEach(index => {
                this.arrAsteroids.splice(index, 1);
            });
        }

        // Colision de balas enemigas con nave player
        if (this.arrEnemyBullets.length > 0) {
            for (let i = this.arrEnemyBullets.length - 1; i >= 0; i--) {
                const enemyBullet = this.arrEnemyBullets[i];
                const enemyBulletRect = enemyBullet.element.getBoundingClientRect();

                if (this.isColliding(spaceshipRec, enemyBulletRect)) {
                    this.spaceship.lossHpAmount(4);
                    this.lifeHud();
                    this.spaceship.collision();
                    enemyBullet.collision();
                    // Eliminamos la bala enemiga del arreglo
                    this.arrEnemyBullets.splice(i, 1);
                    break;
                }
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
        // Definimos su tamaño
        const size = Math.floor(Math.random() * 3) + 1;

        // Lo craemos
        let asteroid = new Asteroid(this.gameArea, size);
        // Aseguramos que no colisione/superponga con otro asteroide al crearlo
        if (this.arrAsteroids.length > 0) {
            while (this.isColliding(this.arrAsteroids.at(-1).element.getBoundingClientRect(), asteroid.element.getBoundingClientRect())) {
                asteroid = new Asteroid(this.gameArea, size);
            }
        }
        // Lo agregamos al arreglo de asteroides del nivel
        this.arrAsteroids.push(asteroid);
    }

    //Agregamos la bala al juego.
    addBullet() {
        const x = this.spaceship.x + this.spaceship.width;
        const y = this.spaceship.y + (this.spaceship.height / 2) - 2.5;

        const bullet = new Bullet(x, y, this.gameArea);
        this.arrBullets.push(bullet);
    }

    //Enemigo dispara, gregamos la bala enemiga al juego
    addEnemyBullet() {
        const x = this.enemyShip.x;
        const y = this.enemyShip.y + (this.enemyShip.height * 0.5);
        const enemyBullet = new EnemyBullet(x, y, this.gameArea);
        this.arrEnemyBullets.push(enemyBullet);
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

    // Actualiza el contador de puntaje del jugador
    upDateScoreHud(suma) {
        this.currentScore += suma;
        this.scoreText.textContent = `Puntaje: ${this.currentScore}`;
    }

    //eliminar todos los elementos del juego
    destroy() {
        this.arrAsteroids.forEach(ast => ast.remove());
        this.arrBonus.forEach(bon => bon.remove());
        this.arrBullets.forEach(bull => bull.remove());
        this.arrEnemyBullets.forEach(enemyBull => enemyBull.remove());
        this.enemyShip.removeEnemyShip();
        this.hudLife.remove();
        this.hudAmmunition.remove();
        this.hudAmmunition2.remove();
        this.hudScore.remove();
    }

}