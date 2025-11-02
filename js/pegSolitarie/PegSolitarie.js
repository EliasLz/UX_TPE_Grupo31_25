let canvas = document.getElementById('prueba');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let isMouseDown = false;
let lastPieceClicked = null;
let lastCellClicked = null;
let validNeighbodrsCells = [];
let validNeighbodrsOfNeighbodrsCells = [];

let dashboard = new Dashboard(canvasWidth, canvasHeight, ctx);
//let timer = new Timer();

    //Prepara el juego (Armado del tablero, Colocar piezas, Canvas, etc)
    function init(){
        dashboard.draw();
        //timer.draw();

        play();
    }



    //Logica del juego (Bucle, etc)
    function play(){
        // while(!isGameOver()){

        // }

    }
    //Finalizador del juego(Mostrar resultados, reset del talblero, etc)
    function end(){} 


//Jugabilidad Drag & Drop
    //Se presiona el click
    function onMouseDown(e){
        isMouseDown = true;

        if(lastPieceClicked != null){
            lastPieceClicked.setResaltada(false);
            lastPieceClicked.draw();
            if(validNeighbodrsOfNeighbodrsCells.length > 0){
                validNeighbodrsOfNeighbodrsCells.forEach(cell => {
                    cell.setResaltada(false);
                    cell.draw();
                })
            }
        }

        let clickedPiece = dashboard.findClickedPiece(e.layerX, e.layerY);
        let clickedCell = dashboard.findClickedCell(e.layerX, e.layerY);

        if(clickedPiece != null){
            clickedPiece.setResaltada(true);
            clickedPiece.draw();
            validNeighbodrsOfNeighbodrsCells = dashboard.getValidMoves(clickedPiece.x, clickedPiece.y).at(1);
            validNeighbodrsCells = dashboard.getValidMoves(clickedPiece.x, clickedPiece.y).at(0);
            
            lastPieceClicked = clickedPiece;
            lastCellClicked = clickedCell;
            if(validNeighbodrsOfNeighbodrsCells.length > 0){
                validNeighbodrsOfNeighbodrsCells.forEach(cell => {
                    cell.setResaltada(true);
                    cell.draw();
                })
            }
        } 
    }

    //Se suelta el click
    function onMouseUp(e){
        isMouseDown = false;
        
        if(lastPieceClicked != null){
                let destineCell = dashboard.findClickedCell(e.layerX, e.layerY);
                if(destineCell == null) {
                    lastPieceClicked.setPosition(lastCellClicked.x + (dashboard.cellWidth/2), lastCellClicked.y + (dashboard.cellHeight/2));
                    dashboard.reDraw();
                    return;
                }
                
                let validMove = dashboard.getValidMoves(lastPieceClicked.x, lastPieceClicked.y, destineCell.x, destineCell.y);

                if(destineCell.isValid() && validMove){
                    lastPieceClicked.setPosition(destineCell.x + (dashboard.cellWidth/2), destineCell.y + (dashboard.cellHeight/2));
                    destineCell.setOccupied();
                    lastCellClicked.setEmpty();
                    lastPieceClicked.setResaltada(false);
                    lastPieceClicked.draw();

                    if(validNeighbodrsOfNeighbodrsCells.length > 0){
                        validNeighbodrsOfNeighbodrsCells.forEach(cell => {
                        cell.setResaltada(false);
                        cell.draw();
                    })}
                    dashboard.deleteNeighbodrsPiece(validNeighbodrsCells, validNeighbodrsOfNeighbodrsCells, destineCell);

                    lastPieceClicked = null;
                    lastCellClicked = null;
                } else {
                    console.log("estoy aca")
                    lastPieceClicked.setPosition(lastCellClicked.x + (dashboard.cellWidth/2), lastCellClicked.y + (dashboard.cellHeight/2));
                }
                
            }
            dashboard.reDraw();
    }

    //Se mantiene el click
    function onMouseMove(e){
        if(isMouseDown && lastPieceClicked != null){
            lastPieceClicked.setPosition(e.layerX, e.layerY);
            dashboard.reDraw();
            if(validNeighbodrsOfNeighbodrsCells.length > 0){
                validNeighbodrsOfNeighbodrsCells.forEach(cell => {
                    cell.setResaltada(true);
                    cell.draw();
                })
            }
            lastPieceClicked.draw();
        }

    }


    canvas.addEventListener('mousedown', onMouseDown, false)
    canvas.addEventListener('mouseup', onMouseUp, false)
    canvas.addEventListener('mousemove', onMouseMove, false)

    document.addEventListener('DOMContentLoaded', init);