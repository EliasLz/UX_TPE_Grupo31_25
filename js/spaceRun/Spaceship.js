import { Collision } from "./Collision.js";

export class Spaceship extends Collision{
    constructor(gameArea, spaceshipChoice){
        super()
        this.gameArea = gameArea;
        this.spaceshipType = spaceshipChoice;

        this.width = 58;
        this.height = 36;

        this.x = 200
        this.y = Math.floor(this.gameArea.clientHeight / 2) ;

        //Generamos el HTML de la nave 
        this.element = document.createElement('div');
        this.element.className = 'spaceship spaceship'+ this.spaceshipType +'-down';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        this.gameArea.appendChild(this.element);

        //Estadisticas default de la nave.
        this.hp = 8;
        this.isEnabled = true;
        this.ammunition = 12;

        this.isSheilded = false;
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
        this.element.className = 'spaceship spaceship' + this.spaceshipType + '-up';
        this.setPosition(this.x, this.y - 1);
    }
    downMove(){
        this.element.className = 'spaceship spaceship' + this.spaceshipType + '-down';
        this.setPosition(this.x, this.y + 1);
    }

    //Sumar o restar vida.
    addHp() {
        this.hp++;
    }
    lossHp() {
        this.hp--;
    }

    lossHpAmount(){
        this.hp -= 2;
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
        if(this.ammunition + ammo > 12){
            this.ammunition = 12;
            return
        }

        this.ammunition += ammo;
    }

    // Agregamos el escudo y el efecto visual
    addSheild(){
        if (this.isSheilded) return; // Si ya tiene escudo, no hacemos nada
        this.isSheilded = true;
        let sheild = document.createElement('div');
        sheild.id = 'sheild';
        sheild.className = 'sheild-effect';
        this.element.appendChild(sheild);
    }

    removeSheild(){
        this.isSheilded = false;
        let sheild = this.element.querySelector('#sheild');
        console.log(sheild);
        if(sheild){
            sheild.className = 'sheild-destroyed';
            sheild.addEventListener('animationend', ()=>{
                sheild.remove();
            })
        }
    }
    
    //Efecto de colision
    collision(){
        let animation = document.createElement('div');
        if(this.hp > 1 ){
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
        this.element.remove();
    }
}