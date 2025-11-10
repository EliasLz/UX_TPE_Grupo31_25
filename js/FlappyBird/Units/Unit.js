export class Unit{
    constructor(){

        
    }

    /* esta se repite en cada frame y su implementacion es distinta en cada unidad hija */
    onCollision(){ //ejemplo para PlayerUnit

        if (detectCollision(this, unidadMuro)) {
        /* muere y detiene scroll */
        }
        
        if (detectCollision(this, unidadObjetoPowerUp)) {
        /* +1 al atributo cantidadVidas */
        }

        // ........etc etc etc

    }

    detectColision(){
        // esto devuelve un boolean
    }
    


    

}