export class Piece{
    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.radius = 30
        this.highlighted = false;

        this.ctx = ctx;
        this.image = new Image();
        this.imageSize = 90; 
        
        this.rosca = 'assets/img-Peg-Solitarie/Rosca.png';
        this.duff = 'assets/img-Peg-Solitarie/Duff.png';
    }

    //Dibuja la pieza.
    draw(){
        if(this.highlighted === true){
            this.ctx.beginPath();
            this.imageSize = 100;
            // Dibujamos un círculo un poco más grande que la pieza para que actúe como borde/sombra
            this.ctx.arc(this.x, this.y , this.radius + 3, 0, Math.PI * 2); 
            this.ctx.fillStyle = "#0000004f"; // Color rojo para resaltar
            this.ctx.fill();
        } else {
            this.imageSize = 90;
        }
        const size = this.imageSize;
        this.image.src = this.duff;
        const offset = size / 2;
        const topLeftX = this.x - offset; 
        const topLeftY = this.y - offset;
        
        this.ctx.drawImage(this.image, topLeftX, topLeftY, size, size);
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