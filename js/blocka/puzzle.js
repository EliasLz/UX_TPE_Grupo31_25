import { addTotalTime } from './timer.js';
import { parseTime } from './utils.js';

export let puzzlePieces = [];



//Variables para mantener el 'contexto' de una forma global 
let puzzleContext = null; 
let puzzleImage = null;
let puzzlePieceWidth = 0;
let puzzlePieceHeight = 0;
let currentLevelIndex = 0;

export function prepareGame(selectedConfig, img, onLevelComplete, currentImageIndex){
    const gameContainer = document.getElementById('gameScreen');
    const gameBar = document.querySelector('.gameButtonbar')
    gameContainer.innerHTML = `
    <canvas id="miCanvas"></canvas>
    <div class="timerDisplay" id="timerDisplay"> 00:00 </div>
    <button id="hint" class="btnHelp"> <img src="assets/icons/ayuda.png" alt="Ayuda" > </button>
    `;
    gameBar.style.display = '';
    const pieces = selectedConfig.piecesCount;

    playGame(pieces, img, onLevelComplete, currentImageIndex);
}

function playGame(pieces, imagenUrl, onLevelComplete, currentImageIndex){

    const canvas = document.getElementById('miCanvas');
    const ctx = canvas.getContext('2d');

    // Define en cuántas piezas quieres dividir la imagen
    const COLUMNAS = pieces / 2;
    const FILAS = 2;

    // Cargamos la Imagen
    const imagen = new Image();
    imagen.src = imagenUrl;

    // Nos aseguramos de que la imagen se haya cargado completamente antes de usarla
    imagen.onload = () => {
        // Calculamos el tamaño ideal del canvas para que las piezas sean lo más cuadradas posible
        let targetWidth = imagen.width;
        let targetHeight = imagen.height;
        
        // Calculamos la relación de aspecto deseada basada en el número de columnas y filas
        const targetAspectRatio = (COLUMNAS / FILAS);
        const currentAspectRatio = imagen.width / imagen.height;
        
        // Ajustamos el tamaño para mantener piezas más cuadradas
        if (currentAspectRatio > targetAspectRatio) {
            // La imagen es más ancha de lo necesario
            targetWidth = imagen.height * targetAspectRatio;
        } else {
            // La imagen es más alta de lo necesario
            targetHeight = imagen.width / targetAspectRatio;
        }

        // Ajustamos el tamaño del canvas
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Calculamos el ancho y alto de cada pieza
        const anchoPieza = targetWidth / COLUMNAS;
        const altoPieza = targetHeight / FILAS;

        //Guardamos en variables estos datos (para que )
        puzzleContext = ctx;
        puzzleImage = imagen;
        puzzlePieceWidth = anchoPieza;
        puzzlePieceHeight = altoPieza;
        currentLevelIndex = currentImageIndex;


        // Recorremos cada fila y columna para dibujar las piezas
        puzzlePieces = [];
        for (let fila = 0; fila < FILAS; fila++) {
            for (let col = 0; col < COLUMNAS; col++) {
                puzzlePieces.push({
                    col: col,
                    row: fila,
                    rotation: Math.floor(Math.random() * 3 + 1) * 90 // Rotación inicial aleatoria (0, 90, 180, 270)
                });
            }
        }

        drawPuzzle(ctx, imagen, anchoPieza, altoPieza, currentImageIndex);
    };

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    canvas.addEventListener('mousedown', (evento) => {

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (evento.clientX - rect.left) * scaleX;
        const y = (evento.clientY - rect.top) * scaleY;


        const anchoPieza = canvas.width / COLUMNAS;
        const altoPieza = canvas.height / FILAS;

        
        const piezaIndex = getClickedPiece(x, y, puzzlePieces, anchoPieza, altoPieza);
        if(piezaIndex !== -1){
            let rotation = 0;
            if(evento.button === 0){
                rotation = 90;
            }else if(evento.button === 2){
            rotation = -90;
            }
            
            if(rotation !== 0){
                puzzlePieces[piezaIndex].rotation += rotation;
                puzzlePieces[piezaIndex].rotation = (puzzlePieces[piezaIndex].rotation + 360 ) % 360;
                // redibujar solo la pieza modificada
                const pieza = puzzlePieces[piezaIndex];
                redrawPiece(ctx, imagen, pieza, anchoPieza, altoPieza, currentImageIndex);

                if(isCompleted()){
                    //cargamos el tiempo total del nivel
                    let time = document.getElementById('timerDisplay').textContent;
                    addTotalTime(parseTime(time));
                    canvas.style.pointerEvents = 'none';
                    
                    
                    setTimeout(()=>{
                        canvas.style.display = 'none'; // Desabilito el canvas
                        
                        let container = document.createElement('div');
                        container.id = 'game-option-Screen';
                        container.classList.add('partial-screen');
                        let finalMessage = '';
            
                        finalMessage = `
                            <h2>¡Felicidades!</h2>
                            <p>Tu tiempo fue de ${time}.</p>
                            <div id="endGameButtons">
                                <button id="menuButton" class="btn-Menu-game">Menu Principal</button>
                                <button id="nextLevelButton" class="nextLevelButton">Proximo Nivel</button>
                            </div>
                            `;
                        
                        document.getElementById('timerDisplay').style.display = 'none';
                        container.innerHTML = finalMessage;
                        document.getElementById('gameScreen').appendChild(container);
    
                        document.getElementById('nextLevelButton').addEventListener('click', ()=>{
                            onLevelComplete();
                        })
                    }, 1000)
                }
            }


        }
    });
};


// Redibuje una sola pieza usando un lienzo fuera de la pantalla para evitar afectar las piezas adyacentes
function redrawPiece(ctx, imagen, pieza, anchoPieza, altoPieza, currentImageIndex){
    // Para evitar artefactos por bordes previamente dibujados en piezas adyacentes,
    // redibujamos todo el puzzle con la nueva rotación. drawPuzzle ya omite
    // líneas y filtros para piezas alineadas, por lo que el resultado quedará limpio.
    drawPuzzle(ctx, imagen, anchoPieza, altoPieza, currentImageIndex);
}

function drawPuzzle(ctx, imagen, anchoPieza, altoPieza, currentImageIndex) {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let filter = 'none';

    if (currentImageIndex > 0){ //--> aplicamos los filtros a los niveles posteriores al 1.
        const filters = [
            'invert(100%)',  //negativo.
            'brightness(30%)', //brillo del 30%.
            'grayscale(100%)' //escala de grises.
            //se podrian agregar mas aca.
        ];
        //al usar el % indicamos que si tiene mas niveles que filtros, estos se repiten ciclicamente.
        //y la parte de (currentImageIndex - 1) es para que el nivel 2(currentImageIndex = 1) empiece con el 1er filtro.
        filter = filters[(currentImageIndex - 1) % filters.length] 
    }
    // Si todo el puzzle está completado, anulamos cualquier filtro a nivel de pieza
    // para mostrar la imagen limpia.
    const allAligned = isCompleted();

    puzzlePieces.forEach(pieza => {
        const rotation = pieza.rotation;
        const sourceX = pieza.col * anchoPieza;
        const sourceY = pieza.row * altoPieza;

        ctx.save();

        const destinoX = sourceX + anchoPieza / 2;
        const destinoY = sourceY + altoPieza / 2;
        
        ctx.translate(destinoX, destinoY);
        ctx.rotate(rotation * Math.PI / 180);

        // Si todo está alineado, forzamos 'none' en todas las piezas.
        // Si no, las piezas alineadas individuales también quedan sin filtro.
        let pieceFilter = allAligned ? 'none' : filter;

        ctx.filter = pieceFilter;

        ctx.drawImage(
            imagen,
            sourceX, sourceY,
            anchoPieza, altoPieza,
            -anchoPieza / 2, -altoPieza / 2,
            anchoPieza, altoPieza
        );


        // Solo dibujar líneas si la pieza NO está alineada
        if ((rotation % 360) !== 0) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.strokeRect(
                -anchoPieza / 2, -altoPieza / 2,
                anchoPieza, altoPieza);
        }

        ctx.restore();
    });
}

function isCompleted(){
    return puzzlePieces.every(piece => (piece.rotation % 360)===0);
}

export function accommodatePice(){
    const unordenerPieces = [];

    puzzlePieces.map(piece => {
        if(piece.rotation !== 0){
            unordenerPieces.push(piece);
        }
    })

    if (unordenerPieces.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * unordenerPieces.length);
    const rdmPiece = unordenerPieces[randomIndex]
    
    rdmPiece.rotation = 0;
    
    if (puzzleContext) {
        redrawPiece(
            puzzleContext, 
            puzzleImage, 
            rdmPiece, 
            puzzlePieceWidth, 
            puzzlePieceHeight,
            currentLevelIndex
        );
    }

    return true;
}

// Función para determinar qué pieza fue clickeada considerando la rotación
function getClickedPiece(x, y, piezas, anchoPieza, altoPieza) {
    for (let i = 0; i < piezas.length; i++) {
        const pieza = piezas[i];
        const centerX = pieza.col * anchoPieza + anchoPieza / 2;
        const centerY = pieza.row * altoPieza + altoPieza / 2;

        // Trasladamos el punto clickeado al sistema de coordenadas de la pieza
        const dx = x - centerX;
        const dy = y - centerY;

        // Aplicamos rotación inversa
        const angle = -pieza.rotation * Math.PI / 180;
        const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
        const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);

        // Verificamos si el punto transformado está dentro del rectángulo de la pieza
        if (
            rotatedX >= -anchoPieza / 2 && rotatedX <= anchoPieza / 2 &&
            rotatedY >= -altoPieza / 2 && rotatedY <= altoPieza / 2
        ) {
            return i;
        }
    }
    return -1;
}