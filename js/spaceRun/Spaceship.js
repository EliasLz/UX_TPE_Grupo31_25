import { Collision } from "./Collision.js";

export class Spaceship extends Collision{
    constructor(gameArea){
        super()
        this.gameArea = gameArea;

        this.width = 58;
        this.height = 36;

        this.x = 200
        this.y = this.gameArea.clientHeight / 2 ;

        //Generamos el HTML de la nave 
        this.element = document.createElement('div');
        this.element.className = 'spaceship spaceship-down';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        this.gameArea.appendChild(this.element);

        //Estadisticas default de la nave.
        this.hp = 3;
        this.isEnabled = true;
        this.ammunition = 200;
    }

    setPosition(x, y){
        if (y < 0) { //--> Evitamos que se vaya para arriba.
            y = 0;
        }
        if (y > this.gameArea.clientHeight - this.height) { //--> Evitamos que se vaya para abajo.
            y = this.gameArea.clientHeight - this.height;
        }
        
        this.x = x;
        this.y = y;

        // 3. Actualizar el estilo CSS del elemento HTML
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    //Auxiliares de movimiento.
    upMove(){
        this.element.className = 'spaceship spaceship-up';
        this.setPosition(this.x, this.y - 1);
    }
    downMove(){
        this.element.className = 'spaceship spaceship-down';
        this.setPosition(this.x, this.y + 1);
    }

    //Sumar o restar vida.
    addHp() {
        this.hp++;
    }
    lossHp() {
        this.hp--;
    }
    
    //Disparar.
    shooting() {
        if(this.isEnabled){
            this.ammunition--;
        }
    }
    //Habilitar el disparo.
    enableShooting(){
        this.isEnabled = true;
    }
    //deshabilitar el disparo.
    disabledShooting(){
        this.isEnabled = false;
    }
    //Agregar municion.
    addAmmunition(ammo){
        this.ammunition += ammo;
    }
    
    //Efecto de colision
    collision(){
        let animation = document.createElement('div');
        if(this.hp > 0 ){
            animation.className = 'spaceship-sparks';
            this.element.appendChild(animation);
            animation.addEventListener('animationend' , ()=>{
                animation.remove();
            })
        } else {
            animation.className = 'spaceship-explode';
            this.element.appendChild(animation);
            animation.addEventListener('animationend', ()=>{
                this.remove();
            })
        }
    }

    remove(){
        this.gameArea.removeChild(this.element);
    }
}