let canvas = document.getElementById('prueba');
let ctx = canvas.getContext('2d');
let imgFondo = new Image();
imgFondo.src = './assets/img-Peg-Solitarie/FondoPantalla.png';


let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let isMouseDown = false;
let lastPieceClicked = null;
let lastCellClicked = null;
let validNeighbodrsCells = [];
let validNeighbodrsOfNeighbodrsCells = [];

let dashboard = new Dashboard(canvasWidth, canvasHeight, ctx);

// Función para dibujar el fondo
function drawBackground() {
    // Dibujamos la imagen de fondo en todo el canvas
    ctx.drawImage(imgFondo, 0, 0, canvas.width, canvas.height);
}

imgFondo.onload = function(){
    dashboard.reDraw();
}

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
            resetLastPositions();
            dashboard.reDraw();
        }

        let mause = getMausePos(e);
        let clickedPiece = dashboard.findClickedPiece(mause.x, mause.y);
        let clickedCell = dashboard.findClickedCell(mause.x, mause.y);

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
            let mause = getMausePos(e);
            let destineCell = dashboard.findClickedCell(mause.x, mause.y);

            //no hacemos nada si destino es null o es la misma celda de origen
            if(destineCell == null || (destineCell.x == lastCellClicked.x && destineCell.y == lastCellClicked.y)) {
                lastPieceClicked.setPosition(lastCellClicked.x + (dashboard.cellWidth/2), lastCellClicked.y + (dashboard.cellHeight/2));
                resetLastPositions();
                dashboard.reDraw();
                return;
            }

            //chequeo si el movimiento es valido
            let validMove = validNeighbodrsOfNeighbodrsCells.some(cell => cell.x == destineCell.x && cell.y == destineCell.y);


            if(destineCell.isValid() && validMove ){
                lastPieceClicked.setPosition(destineCell.x + (dashboard.cellWidth/2), destineCell.y + (dashboard.cellHeight/2));
                destineCell.setOccupied();
                lastCellClicked.setEmpty();

                dashboard.deleteNeighbodrsPiece(validNeighbodrsCells, validNeighbodrsOfNeighbodrsCells, destineCell);
                resetLastPositions();
                
            } else {
                lastPieceClicked.setPosition(lastCellClicked.x + (dashboard.cellWidth/2), lastCellClicked.y + (dashboard.cellHeight/2));
                resetLastPositions();
            }
            
        }
        dashboard.reDraw();
    }

    //Se mantiene el click
    function onMouseMove(e){
        if(isMouseDown && lastPieceClicked != null){
            let mause = getMausePos(e);
            lastPieceClicked.setPosition(mause.x, mause.y);
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

    //obtenemos la posicion del mouse
    function getMausePos(event){
        return {
            x : Math.round(event.clientX - canvas.offsetLeft),
            y : Math.round(event.clientY - canvas.offsetTop)
        }
    }


    //borramos las ultimas posiciones resaltadas y el estado de las piezas
    function resetLastPositions(){
        lastPieceClicked.setResaltada(false);
        lastPieceClicked.draw();
        lastPieceClicked = null;
        lastCellClicked = null;

        validNeighbodrsOfNeighbodrsCells.forEach(cell => {
            cell.setResaltada(false);
            cell.draw();
        });
        validNeighbodrsCells = [];
        validNeighbodrsOfNeighbodrsCells = [];
    }



canvas.addEventListener('mousedown', onMouseDown, false)
canvas.addEventListener('mouseup', onMouseUp, false)
canvas.addEventListener('mousemove', onMouseMove, false)

document.addEventListener('DOMContentLoaded', init);