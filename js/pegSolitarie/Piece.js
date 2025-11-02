class Piece{
    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.radius = 30
        this.highlighted = false;

        this.ctx = ctx;
    }

    //Dibuja la pieza.
    draw(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y , this.radius, 0, Math.PI * 2);

        if(this.highlighted === true){
            this.ctx.fillStyle = "#ac0101ff";
            this.ctx.fill();
        }else{
            this.ctx.fillStyle = "#13e321ff";
            this.ctx.fill();
        }
    }
    //Obtiene la posicion de la pieza.
    getPosition(){}

    //Setea la posicion de la pieza.
    setPosition(x,y){
        this.x = x;
        this.y = y;
    }
    
    //Elimina la pieza.
    delete(){}

    //Resaltar pieza.
    setResaltada(highlight){
        this.highlighted = highlight;
    }

    //El click fue dentro de la pieza?
    isPointInside(x,y){
        let _x = this.x - x;
        let _y = this.y - y;
        return Math.sqrt(_x * _x + _y * _y) < this.radius
    }
}