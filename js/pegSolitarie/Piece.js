class Piece{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    //Dibuja la pieza.
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y , 15, 0, Math.PI * 2);
        ctx.fillStyle = "#fbfafaff";
        ctx.fill();
    }
    getPosition(){}//Obtiene la posicion de la pieza.
    setPosicion(){}//Setea la posicion de la pieza.
    delete(){}//Elimina la pieza.
}