import { Asteroid } from './Asteroid.js';
import { Life } from './Bonus/Life.js';
import { Weapon } from './Bonus/Weapon.js';

export class Space {
    constructor(gameContainer){
        this.gameArea = gameContainer;
        this.gameSpeed = 2; //--> Velocidad del scroll.

        this.arrAsteroids = [];
        this.arrBonus = [];

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
    checkCollisions(spaceship){
        const spaceshipRec = spaceship.getboundingClientRect();

        this.arrAsteroids.forEach(ast => {
            const astRect = ast.element.getBoundingClientRect();

            if(
                spaceshipRec.left < astRect.right &&
                spaceshipRec.right > astRect.left &&
                spaceshipRec.top < astRect.bottom &&
                spaceshipRec.bottom > astRect.top
            ){
                return 1;
            }
        });

        this.arrBonus.forEach(ast => {
            const astRect = ast.element.getBoundingClientRect();

            if(
                spaceshipRec.left < astRect.right &&
                spaceshipRec.right > astRect.left &&
                spaceshipRec.top < astRect.bottom &&
                spaceshipRec.bottom > astRect.top
            ){
                return -1;
            }
        });
        return 0;
    }

    //Agregamos Asteroides al juego.
    addAsteroid(){
        const asteroid = new Asteroid(this.gameArea);
        this.arrAsteroids.push(asteroid);
    }
    
    //Agregamos Bonus al juego.
    addBonus(){
        let rndSpawn = Math.floor(Math.random() * 10);
        if(rndSpawn > 3){
            const bonus = new Weapon(this.gameArea);
            this.arrBonus.push(bonus);
        }else{
            const bonus = new Life(this.gameArea);
            this.arrBonus.push(bonus);
        }
    }



}