import { Bonus } from './Bonus.js'

export class Sheild extends Bonus{
    constructor(gameArea, bonus){
        super(gameArea, bonus)

        this.element.className += ' sheild bonus-sheild';
    }

    //Efecto al colisionar
    collision(){
        this.addSheild();
    }

    addSheild(){
        return this.bonus;
    }
}