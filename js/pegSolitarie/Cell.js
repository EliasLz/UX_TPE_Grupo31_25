class Cell{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isEmpty = true;
    }

    //Dibuja la celda.
    draw(ctx){
        ctx.fillStyle = '#000000ff'; // Color de la celda
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    getPosition(){}//Obtiene la posicion de la celda.
    animate(){}//Animacion de la celda.

    //Validar si esta vacia o no.
    isValid(){
        return this.isEmpty;
    }

    setEmpty(){
        this.isEmpty = true;
    }
    setOccupied(){
        this.isEmpty = false;
    }
}