import { Dashboard } from "./Dashboard.js";
import { showEndMenu, showMenu } from "./Config.js";
import { Counter } from "./Counter.js";

let CounterValue = 0;
let isMouseDown = false;
let lastPieceClicked = null;
let lastCellClicked = null;
let validNeighbodrsCells = [];
let validNeighbodrsOfNeighbodrsCells = [];


export function ejecutionPeg() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if(currentPage != 'game.html'){
        return;
    }
    const playButton = document.getElementById('playButton');
    
    playButton.addEventListener('click',  ()=>{
        init();
        playButton.style.display = 'none';
    });
}


//Prepara el juego (Armado del tablero, Colocar piezas, Canvas, etc)
async function init(){
    let containerGame = document.getElementById('gameScreen');

    containerGame.innerHTML = '';

    const config = await showMenu();
    
    containerGame.innerHTML = '';

    //Creamos el canvas
    const canvasContainer = document.createElement('canvas');
    canvasContainer.id = 'canvasContainer'
    containerGame.appendChild(canvasContainer);

    let canvas = document.getElementById('canvasContainer');
    canvas.width = 750;
    canvas.height = 750;
    
    let ctx = canvas.getContext('2d');

    
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let dashboard = new Dashboard(canvasWidth, canvasHeight, ctx);
    let counter = new Counter(ctx);
   //counter.show();

    playGame();

    function playGame(){
 
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mousemove', onMouseMove, false);
        
    }


    //Jugabilidad Drag & Drop
        //Si presiona el click izquierdo
        function onMouseDown(e){

            if(e.button !== 0) return;

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
                

                validNeighbodrsOfNeighbodrsCells.forEach(cell =>{
                    cell.setResaltada(true);
                    cell.startPulse();   // empieza a “respirar”
                })

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
    
        //Se suelta el click izquierdo
        function onMouseUp(e){

            if(e.button !== 0) return;

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
        
        
                    if(destineCell.isValid() && validMove){
                        lastPieceClicked.setPosition(destineCell.x + (dashboard.cellWidth/2), destineCell.y + (dashboard.cellHeight/2));
                        destineCell.setOccupied();
                        lastCellClicked.setEmpty();
        
                        dashboard.deleteNeighbodrsPiece(validNeighbodrsCells, validNeighbodrsOfNeighbodrsCells, destineCell);
                        resetLastPositions();
                        counter.discount();

                    
                } else {
                    lastPieceClicked.setPosition(lastCellClicked.x + (dashboard.cellWidth/2), lastCellClicked.y + (dashboard.cellHeight/2));
                    resetLastPositions();
                }
                
            }
    
             if(dashboard.isGameOver()){
                let p = document.createElement('p');
                if(dashboard.getPieces().length == 1){
                    p.innerHTML = 'Usted a ganado';
                } else {
                    p.innerHTML = 'Usted perdio'
                }
                message.appendChild(p);
                console.log(message)
                deletElementos();
                init(); //reinicimaos el juego
            }
    
            dashboard.reDraw();
        }
        
        function deletElementos(){
            dashboard.deleteElements();
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
        function getMausePos(event){     //TODO:: Chequear que ande con el re escalado en el canvas
            const rect = canvas.getBoundingClientRect();

            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

    
            const clientX = event.clientX - rect.left;
            const clientY = event.clientY - rect.top;
            return {
                x : Math.round(clientX * scaleX),
                y : Math.round(clientY * scaleY)
            }
        }
    
    
        //borramos las ultimas posiciones resaltadas y el estado de las piezas
        function resetLastPositions(){
            validNeighbodrsOfNeighbodrsCells.forEach(cell =>{
                cell.setResaltada(false);
                cell.stopPulse(); 
            })
            if (lastPieceClicked) {
                lastPieceClicked.setResaltada(false);
                lastPieceClicked.draw();
            }
            lastPieceClicked = null;
            lastCellClicked = null;

            validNeighbodrsCells = [];
            validNeighbodrsOfNeighbodrsCells = [];
        }
}