export let puzzlePieces = [];

export function prepareGame(selectedConfig, img, onLevelComplete, currentImageIndex){
    const gameContainer = document.getElementById('gameScreen');
    const gameBar = document.querySelector('.gameButtonbar')
    gameContainer.innerHTML = `
    <canvas id="miCanvas"></canvas>
    <div id="timerDisplay" class="timerDisplay"> 00:00 </div>
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
        // Ajustamos el tamaño del canvas para que coincida con el de la imagen
        canvas.width = imagen.width;
        canvas.height = imagen.height;

        // Calculamos el ancho y alto de cada pieza
        const anchoPieza = imagen.width / COLUMNAS;
        const altoPieza = imagen.height / FILAS;

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
        const x = evento.clientX - rect.left;
        const y = evento.clientY - rect.top;

        const anchoPieza = canvas.width / COLUMNAS;
        const altoPieza = canvas.height / FILAS;

        const columnaClickeada = Math.floor(x / anchoPieza);
        const filaClickeada = Math.floor(y / altoPieza);

        const piezaIndex = puzzlePieces.findIndex(p => p.col === columnaClickeada && p.row === filaClickeada);
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
                    console.log("nivel completado")
                    setTimeout(()=>{
                        onLevelComplete();
                    }, 1000)
                }
            }


        }
    });
};

// Dibuja una sola pieza del rompecabezas (usa la misma lógica que drawPuzzle pero para una sola pieza)
function drawPiece(ctx, imagen, pieza, anchoPieza, altoPieza, currentImageIndex){
    const rotation = pieza.rotation;
    const sourceX = pieza.col * anchoPieza;
    const sourceY = pieza.row * altoPieza;

    ctx.save();

    const destinoX = sourceX + anchoPieza / 2;
    const destinoY = sourceY + altoPieza / 2;
    ctx.translate(destinoX, destinoY);
    ctx.rotate(rotation * Math.PI / 180);

    let filter = 'none';
    if (currentImageIndex > 0){
        const filters = [
            'invert(100%)',
            'brightness(30%)',
            'grayscale(100%)'
        ];
        filter = filters[(currentImageIndex - 1) % filters.length]
    }

    ctx.filter = filter;

    ctx.drawImage(
        imagen,
        sourceX, sourceY,
        anchoPieza, altoPieza,
        -anchoPieza / 2, -altoPieza / 2,
        anchoPieza, altoPieza
    );

    ctx.filter = 'none';

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(
        -anchoPieza / 2, -altoPieza / 2,
        anchoPieza, altoPieza);

    ctx.restore();
}

// Redibuje una sola pieza usando un lienzo fuera de la pantalla para evitar afectar las piezas adyacentes
function redrawPiece(ctx, imagen, pieza, anchoPieza, altoPieza, currentImageIndex){
    // Crea un lienzo fuera de pantalla que coincida con el tamaño del lienzo completo
    const offscreen = document.createElement('canvas');
    offscreen.width = ctx.canvas.width;
    offscreen.height = ctx.canvas.height;
    const offscreenCtx = offscreen.getContext('2d');

    // Copiar el estado actual del lienzo principal fuera de la pantalla
    offscreenCtx.drawImage(ctx.canvas, 0, 0);

    // Limpia solo el área de esta pieza (sin considerar rotación, límites exactos de la pieza)
    const sourceX = pieza.col * anchoPieza;
    const sourceY = pieza.row * altoPieza;
    offscreenCtx.clearRect(sourceX, sourceY, anchoPieza, altoPieza);

    // Dibuja solo esta pieza en el lienzo fuera de la pantalla.
    drawPiece(offscreenCtx, imagen, pieza, anchoPieza, altoPieza, currentImageIndex);

    // Copiar todo de nuevo al lienzo principal
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(offscreen, 0, 0);

    // Si la pieza está correctamente orientada, dibuje un borde de color lima (alineado con el eje)
    if ((pieza.rotation % 360) === 0){
        ctx.save();
        ctx.filter = 'none';
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 3;
        ctx.strokeRect(pieza.col * anchoPieza, pieza.row * altoPieza, anchoPieza, altoPieza);
        ctx.restore();
    }
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

    puzzlePieces.forEach(pieza => {
        const rotation = pieza.rotation;
        const sourceX = pieza.col * anchoPieza;
        const sourceY = pieza.row * altoPieza;

        ctx.save();

        const destinoX = sourceX + anchoPieza / 2;
        const destinoY = sourceY + altoPieza / 2;
        
        ctx.translate(destinoX, destinoY);

        ctx.rotate(rotation * Math.PI / 180);
        
        ctx.filter = filter;

        ctx.drawImage(
            imagen,
            sourceX, sourceY,
            anchoPieza, altoPieza,
            -anchoPieza / 2, -altoPieza / 2,
            anchoPieza, altoPieza
        );

        ctx.filter = 'none' //reset

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.strokeRect(
            -anchoPieza / 2, -altoPieza / 2,
            anchoPieza, altoPieza);
        
        ctx.restore();
    });
}

function isCompleted(){
    return puzzlePieces.every(piece => (piece.rotation % 360)===0);
}