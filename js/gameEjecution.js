const GAME_DEFAULTS = {
    piecesCount: 4,
    maxTime: 0,          // 0 para sin límite, > 0 para límite en segundos
    useHelp: false
};

const IMAGE_BANK = [
    'assets/img-Blocka/Loro.png', 
    'assets/img-Blocka/Panda.jpg', 
    'assets/img-Blocka/Pollo.png',
    'assets/img-Blocka/Tigre.png',
    'assets/img-Blocka/Zorro.png',
    'assets/img-Blocka/Puma.jpg',
];

let puzzlePieces = [];

export function ejecution() {
    const playButton = document.getElementById('playButton');

    playButton.addEventListener('click', async ()=>{
        //gameContainer.innerHTML = '<h2>Cargando juego...</h2>'; //TODO:: Hacer una animacion.
        playButton.style.display = 'none';
        const gameConfig = await configureGame();
        prepareGame(gameConfig);
    })
}

function configureGame() {
    const gameContainer = document.getElementById('gameContainer');

    const menuHtml = `
            <div class="config-menu">
                <h3>Configuración del Nivel</h3>
                <form id="configForm">
                    <div class="config-option">
                        <label for="piecesCount">Cantidad de piezas (Blocka):</label>
                        <select id="piecesCount" name="piecesCount">
                            <option value="4" selected>4 Piezas (2x2) - Fácil</option>
                            <option value="6">6 Piezas (3x2) - Medio</option> 
                            <option value="8">8 Piezas (4x2) - Difícil</option>
                        </select>
                    </div>

                    <div class="config-option">
                        <label for="maxTime">Límite de Tiempo (en segundos):</label>
                        <input type="number" id="maxTime" name="maxTime" min="0" value="0" placeholder="0 = Sin límite">
                        <small>El juego termina si el tiempo se agota.</small>
                    </div>

                    <div class="config-option">
                        <input type="checkbox" id="useHelp" name="useHelp">
                        <label for="useHelp">Habilitar "Ayudita" (+5 segundos de penalización por uso).</label>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button type="submit" class="btn-game">Comenzar Juego</button>
                    </div>
                </form>
            </div>
    `;

    gameContainer.innerHTML = menuHtml;

    return new Promise(resolve => {
        const configForm = document.getElementById('configForm');
        
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const selectedConfig = {
                piecesCount: parseInt(document.getElementById('piecesCount').value),
                maxTime: parseInt(document.getElementById('maxTime').value),
                useHelp: document.getElementById('useHelp').checked
            };

            const overlay = document.getElementById('configOverlay');
            if (overlay) {
                overlay.remove();
            }

            resolve(selectedConfig);
        });
    });
}

function prepareGame(selectedConfig){
    const gameContainer = document.getElementById('gameContainer');
    const randomImage = IMAGE_BANK[Math.floor(Math.random() * IMAGE_BANK.length)];
    gameContainer.innerHTML = `
        <canvas id="miCanvas"></canvas>
    `;
    const pieces = selectedConfig.piecesCount;

    playGame(pieces, randomImage)
}



function playGame(pieces, imagenUrl){
    // Esperamos a que todo el contenido de la página se cargue
  //window.onload = function() {

    // --- 1. CONFIGURACIÓN INICIAL ---
    //const imagen = document.getElementById('imagenOriginal');
    const canvas = document.getElementById('miCanvas');
    const ctx = canvas.getContext('2d');

    // Define en cuántas piezas quieres dividir la imagen
    const COLUMNAS = pieces / 2;
    const FILAS = 2;

    // Cargamos la Imagen
    const imagen = new Image();
    imagen.src = imagenUrl;

    // --- 2. DIVISIÓN DE LA IMAGEN ---
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
                    rotation: Math.floor(Math.random() * 4) * 90 // Rotación inicial aleatoria (0, 90, 180, 270)
                });

                drawPuzzle(ctx, imagen, anchoPieza, altoPieza, COLUMNAS, FILAS);
            }
        }
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

        console.log(`¡Clic en la pieza! Fila: ${filaClickeada}, Columna: ${columnaClickeada}`);

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
                puzzlePieces[piezaIndex].rotation = (puzzlePieces[piezaIndex].rotation + 360 % 360 ) % 360;
                drawPuzzle(ctx, imagen, anchoPieza, altoPieza, COLUMNAS, FILAS);
            }
        }
    });
};

function drawPuzzle(ctx, imagen, anchoPieza, altoPieza, COLUMNAS, FILAS) {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    console.log(ctx)

    puzzlePieces.forEach(pieza => {
        const rotation = pieza.rotation;
        const sourceX = pieza.col * anchoPieza;
        const sourceY = pieza.row * altoPieza;

        ctx.save();

        const destinoX = sourceX + anchoPieza / 2;
        const destinoY = sourceY + altoPieza / 2;

        ctx.translate(destinoX, destinoY);

        ctx.rotate(rotation * Math.PI / 180);

        ctx.drawImage(
            imagen,
            sourceX, sourceY,
            anchoPieza, altoPieza,
            -anchoPieza / 2, -altoPieza / 2,
            anchoPieza, altoPieza
        );

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            -anchoPieza / 2, -altoPieza / 2,
            anchoPieza, altoPieza);
        
        ctx.restore();
    });
}