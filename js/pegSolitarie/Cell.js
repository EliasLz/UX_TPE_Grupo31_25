class Cell{
    constructor(x, y, width, height, ctx){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;

        this.isEmpty = true;
        this.highlighted = false;
    }

    //Dibuja la celda.
    draw(){
        if(this.highlighted === false){
            this.ctx.fillStyle = '#000000ff'; // Color de la celda
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            this.animate();
        }


    }

    //La celda fue clickeada?
    isPointInside(x,y){
        return !(x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height);
    }

    //Animacion de la celda.
    animate(){
        ctx.fillStyle = '#a42323ff'; // Color de la celda resaltada
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    setResaltada(highlight){
        this.highlighted = highlight;
    }


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