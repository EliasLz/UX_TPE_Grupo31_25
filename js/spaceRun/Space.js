import { Asteroid } from './Asteroid.js';
import { Bullet } from './Bullet.js';
import { Life } from './Bonus/Life.js';
import { Weapon } from './Bonus/Weapon.js';
import { Spaceship } from './Spaceship.js';

export class Space {
    constructor(gameContainer){
        this.gameArea = gameContainer;
        this.gameSpeed = 2; //--> Velocidad del scroll.

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
    }

    update(){
        for (let i = this.arrAsteroids.length - 1; i >= 0; i--){ //TODO:: Ver q pasa si esta al revez
            let ast = this.arrAsteroids[i];
            ast.move(this.gameSpeed);

            if(ast.isOffScreen()){
                ast.remove();
                this.arrAsteroids.splice(i,1)
            }
        }

        for (let i = this.arrBonus.length - 1; i >= 0; i--){ //TODO:: Ver q pasa si esta al revez
            let bon = this.arrBonus[i];
            bon.move(this.gameSpeed);

            if(bon.isOffScreen()){
                bon.remove();
                this.arrBonus.splice(i,1)
            }
        }

        for (let i = this.arrBullets.length - 1; i >= 0; i--){ //TODO:: Ver q pasa si esta al revez
            let bull = this.arrBullets[i];
            bull.move(this.gameSpeed);

            if(bull.isOffScreen()){
                bull.remove();
                this.arrBullets.splice(i,1)
            }
        }

        this.astSpawnTimer++;
        this.bonSpawnTimer++;

        if(this.astSpawnTimer >= this.astSpawnInterval){
            this.addAsteroid()
            if (this.astSpawnInterval > 50) { //-->Aparecen ams rapido con el tiempo.
                this.astSpawnInterval -= 0.5;
            }
        this.astSpawnTimer = 0;
        }

        if(this.bonSpawnTimer >= this.bonSpawnInterval){
            this.addBonus()
            if (this.bonSpawnInterval < 5000) { //-->Aparecen ams rapido con el tiempo.
                this.bonSpawnInterval += 0.5;
            }
        this.bonSpawnTimer = 0;
        }
    }

    // Hay/Existe una colision
    checkCollisions(){
        const spaceshipRec = this.spaceship.element.getBoundingClientRect();

        for (let i = this.arrAsteroids.length - 1; i>=0; i--){
            const ast = this.arrAsteroids[i];
            const astRect = ast.element.getBoundingClientRect();

            if(this.isColliding(spaceshipRec,astRect)){
                this.spaceship.lossHp();
                ast.remove();
                this.arrAsteroids.splice(i,1);
                return;
            }

        }
        
        for (let j = this.arrBullets.length - 1; j >= 0; j--) {
            const bull = this.arrBullets[j];
            const bullRect = bull.element.getBoundingClientRect();

            // Ahora iteramos sobre los asteroides usando 'i'
            for (let i = this.arrAsteroids.length - 1; i >= 0; i--) {
                const ast = this.arrAsteroids[i];
                const astRect = ast.element.getBoundingClientRect();

                if (this.isColliding(astRect, bullRect)) {
                    if(ast.hp > 1){
                        ast.lossHp();
                        bull.remove();
                        this.arrBullets.splice(j, 1);
                    }else{
                        bull.remove();
                        this.arrBullets.splice(j, 1);
                        ast.remove();
                        this.arrAsteroids.splice(i, 1);
                    }
                    break; 
                }
            }
        }

        for(let i = this.arrBonus.length - 1; i>=0; i--){
            const bon = this.arrBonus[i];
            const bonRect = bon.element.getBoundingClientRect();

            if(this.isColliding(spaceshipRec,bonRect)){
                if(bon instanceof Life){
                    this.spaceship.addHp();
                }else{
                    this.spaceship.enableShooting();
                    this.spaceship.addAmmunition(bon.getBonus());
                }
                bon.remove();
                this.arrBonus.splice(i,1);
                return;
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
    addAsteroid(){
        const asteroid = new Asteroid(this.gameArea);
        this.arrAsteroids.push(asteroid);
    }

    //Agregamos la bala al juego.
    addBullet(){
        const x = this.spaceship.x + this.spaceship.width; 
        const y = this.spaceship.y + (this.spaceship.height / 2) - 2.5;

        const bullet = new Bullet(x,y,this.gameArea);
        this.arrBullets.push(bullet);
    }
    
    //Agregamos Bonus al juego.
    addBonus(){
        let rndSpawn = Math.floor(Math.random() * 10);
        if(rndSpawn > 3){
            const bonus = new Weapon(this.gameArea, 5);
            this.arrBonus.push(bonus);
        }else{
            const bonus = new Life(this.gameArea, 1);
            this.arrBonus.push(bonus);
        }
    }

    //Movimientos de la nave.
    spaceshipMoveUp(){
        this.spaceship.upMove();
    }
    spaceshipMoveDown(){
        this.spaceship.downMove();
    }
    
    //Disparo de la nave.
    spaceshipShoot(){
        if(this.spaceship.isEnabled && this.spaceship.ammunition > 0){
            console.log("entre")
            this.addBullet()
            this.spaceship.shooting();
        }
        
    }
}