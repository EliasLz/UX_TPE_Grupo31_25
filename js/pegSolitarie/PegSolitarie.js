import { Dashboard } from "./Dashboard.js";
import { Timer } from "./Timer.js";
import { showEndMenu, showMenu } from "./Config.js";

let isMouseDown = false;
let idLoop;
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
export async function init(){
    let containerGame = document.getElementById('gameScreen');
    containerGame.innerHTML = '';

    const buttonBarContainer = document.getElementById('displayTimer');


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
    const config = await showMenu();

    let timer = new Timer(buttonBarContainer,config.maxTime)

    dashboard.initDashboard(config.selectedPiece, config.selectedBoard, config.challengeMode);


    playGame();

    function playGame(){

        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mousemove', onMouseMove, false);

        timer.start();
        gameLoop();
    }
    
    function gameLoop(){
        dashboard.reDraw();
        
        if(isMouseDown && lastPieceClicked != null){
            lastPieceClicked.draw();
        }
        
        if(config.isTimeTrial){
            if(timer.getTime() == 0){
                timer.stop();
                showEndMenu(false, 0);
                return;
            }
        }
        idLoop = requestAnimationFrame(gameLoop);
    }
    
    //Jugabilidad Drag & Drop
    //Si presiona el click izquierdo
    function onMouseDown(e){
        
        if(e.button !== 0) return;
        
            isMouseDown = true;
    
            if(lastPieceClicked != null){
                resetLastPositions();
            }
            
            let mause = getMausePos(e);
            let clickedPiece = dashboard.findClickedPiece(mause.x, mause.y);
            let clickedCell = dashboard.findClickedCell(mause.x, mause.y);
            
            if(clickedPiece != null){
                clickedPiece.setResaltada(true);
                // Marcar como arrastrando para que Dashboard no la dibuje en el array
                if (clickedPiece.getDragging() === false) {
                    clickedPiece.setDragging(true);
                }
                let neighbodrss = dashboard.getValidMoves(clickedPiece.x, clickedPiece.y);
                validNeighbodrsOfNeighbodrsCells = neighbodrss.at(1);
                validNeighbodrsCells = neighbodrss.at(0);
                
                
                validNeighbodrsOfNeighbodrsCells.forEach(cell =>{
                    cell.setResaltada(true);
                    cell.startPulse();   // empieza a “respirar”
                })
                
                lastPieceClicked = clickedPiece;
                lastCellClicked = clickedCell;
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
                    // quitar marca de arrastre
                    if (lastPieceClicked.getDragging() === true) {
                        lastPieceClicked.setDragging(false);
                    }
                    resetLastPositions();
                    return;
                }
    
                    //chequeo si el movimiento es valido
                    let validMove = validNeighbodrsOfNeighbodrsCells.some(cell => cell.x == destineCell.x && cell.y == destineCell.y);
        
        
                    if(destineCell.isValid() && validMove){
                        lastPieceClicked.setPosition(destineCell.x + (dashboard.cellWidth/2), destineCell.y + (dashboard.cellHeight/2));
                        destineCell.setOccupied();
                        lastCellClicked.setEmpty();
        
                        dashboard.deleteNeighbodrsPiece(validNeighbodrsCells, validNeighbodrsOfNeighbodrsCells, destineCell);
                        // quitar marca de arrastre
                        if (lastPieceClicked.getDragging() === true) {
                            lastPieceClicked.setDragging(false);
                        }
                        resetLastPositions();
                    
                } else {
                    lastPieceClicked.setPosition(lastCellClicked.x + (dashboard.cellWidth/2), lastCellClicked.y + (dashboard.cellHeight/2));
                    if (lastPieceClicked.getDragging() === true) {
                        lastPieceClicked.setDragging(false);
                    }
                    resetLastPositions();
                }
                
            }
    
            if(dashboard.isGameOver()){
                timer.stop()
                if(dashboard.getPieces().length == 1){
                    showEndMenu(true, timer.getTime());
                } else {
                    showEndMenu(false, timer.getTime());
                }
                dashboard.deleteElements();
                cancelAnimationFrame(idLoop);
                return;
            }
        }
        
        //Se mantiene el click
        function onMouseMove(e){
            if(isMouseDown && lastPieceClicked != null){
                let mause = getMausePos(e);
                lastPieceClicked.setPosition(mause.x, mause.y);
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
                // asegurar que ya no esté marcado como arrastrando
                if (lastPieceClicked.getDragging() === true) {
                    lastPieceClicked.setDragging(false);
                }
                lastPieceClicked.setResaltada(false);
                lastPieceClicked.draw();
            }
            lastPieceClicked = null;
            lastCellClicked = null;

            validNeighbodrsCells = [];
            validNeighbodrsOfNeighbodrsCells = [];
        }
}