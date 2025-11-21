import { Bonus } from "../Bonus/Bonus.js";

export class Weapon extends Bonus{
    constructor(gameArea, bonus){
        super(gameArea, bonus)

        this.element.className += ' weapon';
        this.element.style.backgroundColor = 'blue';
    }

    //Efecto cuando colisiona
    collision(){
        this.armar();
    }

    armar(){
        return this.getBonus();
    }
    
}