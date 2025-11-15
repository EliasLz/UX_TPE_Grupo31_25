import { Collision } from "./Collision.js";

export class Spaceship extends Collision{
    constructor(x,y,spritesheet,hp){
        super(x,y,spritesheet)

        this.hp = hp;
        this.isEnabled = false;
        this.ammunition = 0;
    }

    //Movimiento de la nave.
    movement(direction){
        if(direction>0){
            this.upMove(direction);
        } else {
            this.downMove(direction);
        }
    }

    //Auxiliares de movimiento.
    upMove(direction){
        this.setPosition(this.x, this.y + direction);
    }
    downMove(direction){
        this.setPosition(this.x, this.y - direction);
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

    }
}