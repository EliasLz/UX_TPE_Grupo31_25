import { Bonus } from './Bonus.js'

export class Life extends Bonus{
    constructor(gameArea, bonus){
        super(gameArea, bonus)

        this.element.className += ' life';
    }

    //Efecto al colisionar
    collision(){
        this.addHp();
    }

    addHp(){
        return this.bonus;
    }
}