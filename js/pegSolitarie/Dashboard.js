class Dashboard {

    constructor(canvasWidth, canvasHeight){
        this.cells = [];
        this.pieces = [];
        this.margin = 20;
        this.cellWidth = (canvasWidth - this.margin * 2) / 7; //TODO:: Chequear si anda.
        this.cellHeight = (canvasHeight - this.margin * 2) / 7;
        this.invalidCells = this.setInvalidCells();
    }

    setInvalidCells(){
        this.invalidCells = [
        [this.margin,this.margin],[this.margin+this.cellWidth, this.margin],[this.margin,this.margin+this.cellHeight],[this.margin+this.cellWidth,this.margin+this.cellHeight],
        [this.margin+(5*this.cellWidth),this.margin],[this.margin+(6*this.cellWidth),this.margin],[this.margin+(5*this.cellWidth),this.margin+this.cellHeight],[this.margin+(6*this.cellWidth),this.margin+this.cellHeight],
        [this.margin,this.margin+(5*this.cellHeight)],[this.margin+this.cellWidth,this.margin+(5*this.cellHeight)],[this.margin,this.margin+(6*this.cellHeight)],[this.margin+this.cellWidth,this.margin+(6*this.cellHeight)],
        [this.margin+(5*this.cellWidth),this.margin+(5*this.cellHeight)],[this.margin+(6*this.cellWidth),this.margin+(5*this.cellHeight)],[this.margin+(5*this.cellWidth),this.margin+(6*this.cellHeight)],[this.margin+(6*this.cellWidth),this.margin+(6*this.cellHeight)]
    ];
    return this.invalidCells;
    }

    isValidCell(x,y){
        for(let i = 0; i < this.invalidCells.length; i++){
            if(x == this.invalidCells[i][0] && y == this.invalidCells[i][1]){
                return false;
            }
        }
        return true;
    }
    //Dibuja el dashboard. (Carga las cells y las piezas con estados por defecto)
    draw(ctx){
        for(let row = 0; row < 7; row++){
            for(let col = 0; col < 7; col++){
                let x = this.margin + col * this.cellWidth;
                let y = this.margin + row * this.cellHeight;
                if(this.isValidCell(x,y) === true){
                    let cell = new Cell(x, y, this.cellWidth, this.cellHeight);
                    cell.draw(ctx);
                    this.cells.push(cell);
                    if(cell.isValid() && !(row == 3 && col == 3)){
                        let piece = new Piece(x+(this.cellWidth/2), y+(this.cellHeight/2));
                        piece.draw(ctx);
                        this.pieces.push(piece);
                        cell.setOccupied();
                        console.log(x, y)
                    }
                }
            }
        }
    }
    getValidMoves(){}//Obtiene los movimientos validos.
    getCell(){}//Obtiene la celda del dashboard.

}