import { Bonus } from "../Bonus/Bonus.js";

export class Weapon extends Bonus{
    constructor(bonus){
        super(bonus)

        this.element.className += ' weapon';
    }

    //Efecto cuando colisiona
    collision(){
        this.armar();
    }

    armar(){
        return this.getBonus();
    }
    
}