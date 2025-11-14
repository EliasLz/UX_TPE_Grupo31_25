import { Cell } from "./Cell.js";
import { Piece } from "./Piece.js";
import { Timer } from "./Timer.js";

export class Dashboard {
    constructor(canvasWidth, canvasHeight, ctx) {
        this.cells = [];
        this.pieces = [];
        this.margin = 20;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.cellWidth = (canvasWidth - this.margin * 2) / 7;
        this.cellHeight = (canvasHeight - this.margin * 2) / 7;
        this.invalidCells = this.setInvalidCells();
        this.ctx = ctx;
        this.timer = new Timer(ctx);
        this.imgFondo = new Image();
        this.imgFondo.src = './assets/img-Peg-Solitarie/FondoPantalla.png';
        this.imageOnload = false;
        
        this.imgFondo.onload = () => {
            this.imageOnload = true;
            // Prepara el tablero cuando se cargó la imagen
            this.initDashboard();
        }
    }

    getPieces() {
        let piecesCopy = [...this.pieces];
        return piecesCopy;
    }



    //Define las celdas invalidas del tablero.
    setInvalidCells() {
        this.invalidCells = [
            [this.margin, this.margin], [this.margin + this.cellWidth, this.margin], [this.margin, this.margin + this.cellHeight], [this.margin + this.cellWidth, this.margin + this.cellHeight],
            [this.margin + (5 * this.cellWidth), this.margin], [this.margin + (6 * this.cellWidth), this.margin], [this.margin + (5 * this.cellWidth), this.margin + this.cellHeight], [this.margin + (6 * this.cellWidth), this.margin + this.cellHeight],
            [this.margin, this.margin + (5 * this.cellHeight)], [this.margin + this.cellWidth, this.margin + (5 * this.cellHeight)], [this.margin, this.margin + (6 * this.cellHeight)], [this.margin + this.cellWidth, this.margin + (6 * this.cellHeight)],
            [this.margin + (5 * this.cellWidth), this.margin + (5 * this.cellHeight)], [this.margin + (6 * this.cellWidth), this.margin + (5 * this.cellHeight)], [this.margin + (5 * this.cellWidth), this.margin + (6 * this.cellHeight)], [this.margin + (6 * this.cellWidth), this.margin + (6 * this.cellHeight)]
        ];
        return this.invalidCells;
    }

    isValidCell(x, y) {
        for (let i = 0; i < this.invalidCells.length; i++) {
            if (x == this.invalidCells[i][0] && y == this.invalidCells[i][1]) {
                return false;
            }
        }
        return true;
    }

    //Cargar celdas, piezas y dibuja el tablero.
    initDashboard() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                let x = this.margin + col * this.cellWidth;
                let y = this.margin + row * this.cellHeight;
                if (this.isValidCell(x, y) === true) {
                    let cell = new Cell(x, y, this.cellWidth, this.cellHeight, this.ctx);
                    this.cells.push(cell);
                }
            }
        }

        this.drawBackground();
        this.drawCells();
    }

    initPieces(img){
        this.cells.forEach(cell => {
            if (!(cell.x === this.margin + 3 * this.cellWidth && cell.y === this.margin + 3 * this.cellHeight)) {
                let pieceX = cell.x + (this.cellWidth / 2);
                let pieceY = cell.y + (this.cellHeight / 2);
                let piece = new Piece(pieceX, pieceY, this.ctx, img);
                this.pieces.push(piece);
                cell.setOccupied();
            }
        });
        this.drawPieces();
    }

    // Dibuja las celdas.
    drawCells() {
        this.cells.forEach(cell => {
            cell.draw();
        });
    }

    // Dibujamo las piezas
    drawPieces() {
        this.pieces.forEach(piece => {
            if (!piece.isDragging) {
                piece.draw();
            }
        });
    }

    drawBackground() {
        // Dibujamos la imagen de fondo en todo el canvas
        if (this.imageOnload) {
            this.ctx.drawImage(this.imgFondo, 0, 0, this.canvasWidth, this.canvasHeight);
        }
    }

    // Redibuja todo el dashboard.
    reDraw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawBackground();
        this.drawCells();
        this.drawPieces();
    }


    //Obtiene los movimientos validos.
    getValidMoves(xInit, yInit) {
        let cellInit = this.findClickedCell(xInit, yInit);
        if (cellInit != null) {
            let validNeighbodrs = this.getValidNeighbors(cellInit);
            return validNeighbodrs;
        }
        return [];
    }

    //Obtengo los vecinos validos de una celda.
    getValidNeighbors(cell) {
        let validNeighbodrsCells = [];
        let validNeighbodrsOfNeighbodrsCells = [];
        let neighbodCell = null;
        for (let i = 0; i < 4; i++) {
            let neighbodrX = cell.x;
            let neighbodrY = cell.y;
            switch (i) {
                case 0: //Vecino de arriba
                    neighbodCell = this.getCell(neighbodrX, neighbodrY - this.cellHeight)
                    if (neighbodCell != null && neighbodCell.isValid() == false) {
                        let jumpCell = this.getCell(neighbodrX, neighbodrY - (2 * this.cellHeight));
                        if (jumpCell != null && jumpCell.isValid() == true) {
                            validNeighbodrsOfNeighbodrsCells.push(jumpCell);
                            validNeighbodrsCells.push(neighbodCell);
                        }
                    }
                    break;
                case 1: //Vecino de abajo
                    neighbodCell = this.getCell(neighbodrX, neighbodrY + this.cellHeight)
                    if (neighbodCell != null && neighbodCell.isValid() == false) {
                        let jumpCell = this.getCell(neighbodrX, neighbodrY + (2 * this.cellHeight));
                        if (jumpCell != null && jumpCell.isValid() == true) {
                            validNeighbodrsOfNeighbodrsCells.push(jumpCell);
                            validNeighbodrsCells.push(neighbodCell);
                        }
                    }
                    break;
                case 2: //Vecino de la izquierda.
                    neighbodCell = this.getCell(neighbodrX - this.cellWidth, neighbodrY)
                    if (neighbodCell != null && neighbodCell.isValid() == false) {
                        let jumpCell = this.getCell(neighbodrX - (2 * this.cellWidth), neighbodrY);
                        if (jumpCell != null && jumpCell.isValid() == true) {
                            validNeighbodrsOfNeighbodrsCells.push(jumpCell);
                            validNeighbodrsCells.push(neighbodCell);
                        }
                    }
                    break;
                case 3: //Vecino de la derecha.
                    neighbodCell = this.getCell(neighbodrX + this.cellWidth, neighbodrY)
                    if (neighbodCell != null && neighbodCell.isValid() == false) {
                        let jumpCell = this.getCell(neighbodrX + (2 * this.cellWidth), neighbodrY);
                        if (jumpCell != null && jumpCell.isValid() == true) {
                            validNeighbodrsOfNeighbodrsCells.push(jumpCell);
                            validNeighbodrsCells.push(neighbodCell);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        return [validNeighbodrsCells, validNeighbodrsOfNeighbodrsCells];
    }

    //Obtiene la celda del dashboard.
    getCell(x, y) {
        const targetX = Math.round(x);
        const targetY = Math.round(y);

        for (let i = 0; i < this.cells.length; i++) {
            const cellX = Math.round(this.cells[i].x);
            const cellY = Math.round(this.cells[i].y);

            if (cellX === targetX && cellY === targetY) {
                return this.cells[i];
            }
        }
        return null;
    }

    //Borar pieza del medio.
    deleteNeighbodrsPiece(vnCell, vnnCell, destineCell) {
        for (let i = 0; i < vnnCell.length; i++) {
            if (vnnCell[i].x === destineCell.x && vnnCell[i].y === destineCell.y) {
                let neighbodrCell = vnCell[i];
                neighbodrCell.setEmpty();
                for (let j = 0; j < this.pieces.length; j++) {
                    if (this.pieces[j].x === neighbodrCell.x + (this.cellWidth / 2) && this.pieces[j].y === neighbodrCell.y + (this.cellHeight / 2)) {
                        this.pieces.splice(j, 1);
                    }
                }
            }
        }
    }

    //Obtiene la celda clickeada.
    findClickedCell(x, y) {
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i].isPointInside(x, y)) {
                return this.cells[i]
            }
        }
        return null;
    }
    
    //Obtiene la pieza del dashboard.
    findClickedPiece(x, y) {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].isPointInside(x, y)) {
                return this.pieces[i]
            }
        }
        return null;
    }

    //Fin del juego.
    isGameOver() {
        for (let i = 0; i < this.pieces.length; i++) {
            let validMoves = this.getValidMoves(this.pieces[i].x, this.pieces[i].y).at(1);
            if (validMoves.length > 0) {
                return false;
            }
        }
        return true;
    }

    deleteElements() {
        this.pieces.forEach(piece => {
            piece = null;
        })
        this.cells.forEach(cell => {
            cell = null;
        })
    }
}