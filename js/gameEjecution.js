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
let gameTimerInterval = null; //--> Es para guardar el Id del intervalo

export function ejecution() {
    const playButton = document.getElementById('playButton');

    playButton.addEventListener('click', async ()=>{
        //gameContainer.innerHTML = '<h2>Cargando juego...</h2>'; //TODO:: Hacer una animacion.
        playButton.style.display = 'none';
        const gameConfig = await configureGame();
        const randomImageOrder = randomOrder(IMAGE_BANK);
        let currentImageIndex = 0;
        let currentTime = 0;

        const gameButtonbar = document.querySelector('.gameButtonbar');
        
        const firsChild = gameButtonbar.firstElementChild;
        const timer = document.createElement('div')
        timer.id = 'timerDisplay';
        timer.textContent = '00:00'
        firsChild.insertAdjacentElement('afterend', timer)

        //Formateamos el tiempo para que se vea mejor. (MM:SS)
        function formatTime(totalSeconds){
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        
        //Handler para el fin del juego por tiempo
        function handlerGameOver(){
            clearInterval(gameTimerInterval); //--> Aca se detiene el timer
            const gameContainer = document.getElementById('gameScreen');
            gameContainer.innerHTML = '<h2>¡Tiempo Agotado!</h2><p>No has completado el puzzle a tiempo.</p>'
            gameButtonbar.style.display = 'none';
        }


        function loadNextLevel() { // <-- NUEVO
            if (currentImageIndex < randomImageOrder.length) {
                // Si aún quedan imágenes en nuestro arreglo aleatorio
                const currentImage = randomImageOrder[currentImageIndex];
                
                prepareGame(gameConfig, currentImage, loadNextLevel); //--> Importante este feature de pasarle un callback
                
                currentImageIndex++;
            
            } else {
                console.log("¡Juego completado!");
                clearInterval(gameTimerInterval); //--> Aca tambien se detiene el timer
                const gameContainer = document.getElementById('gameScreen');
                let finalMessage = '<h2>¡Felicidades!</h2><p>Has completado todos los puzzles.</p>';

                if (gameConfig.maxTime > 0) {
                    // MODO CONTRARRELOJ
                    const timeSpent = gameConfig.maxTime - currentTime;
                    const finalTime = formatTime(timeSpent);
                    finalMessage = `<h2>¡Victoria!</h2><p>Completaste todos los puzzles en modo Contrarreloj con **${finalTime}** de tiempo consumido. ¡Excelente!</p>`;
                } else {
                    // MODO CRONÓMETRO
                    const finalTime = formatTime(currentTime);
                    finalMessage = `<h2>¡Felicidades!</h2><p>Has completado todos los puzzles. Tu tiempo total fue de **${finalTime}**.</p>`;
                }

                gameContainer.innerHTML = finalMessage;
                gameButtonbar.style.display = 'none';
            }
        }

        // Iniciar el primer nivel
        loadNextLevel();
       
        //Iniciamos el timer.
        if(gameTimerInterval) clearInterval(gameTimerInterval); //--> Limpiamos el anterior tiempo (Se podria llegar a guardar para que se vea el mejor tiempo)

        const isCountdown  = gameConfig.maxTime > 0;
        currentTime = isCountdown ? gameConfig.maxTime : 0;
        timer.textContent = formatTime(currentTime);

        gameTimerInterval = setInterval(()=>{
            if(isCountdown){
                currentTime--;
                if(currentTime <= 0){
                    currentTime = 0;
                    clearInterval(gameTimerInterval);
                    handlerGameOver() //--> finalizamos el juego
                }
            } else {
                currentTime++;
            }
            timer.textContent = formatTime(currentTime);
        }, 1000); //--> se ejecutaria cada segundo para hacer el efecto del timer

    })
}


//Se implementa el metodo Fisher-Yates shuffle que es el mas eficiente para hacer esto.
function randomOrder(arrImgs){
    const rdmOrder = [...arrImgs];

    for (let i = rdmOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rdmOrder[i], rdmOrder[j]] = [rdmOrder[j], rdmOrder[i]];
    }

    return rdmOrder;
}

function configureGame() {
    const gameScreen = document.getElementById('gameScreen');
    
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
                        <input type="checkbox" id="timeTrialCheck" name="timeTrialCheck">
                        <label for="timeTrialCheck">Habilitar Modo Contrarreloj</label>
                    </div>

                    <div class="config-option">
                        <label for="maxTime">Límite de Tiempo (min. 30 seg):</label>
                        <input type="number" id="maxTime" name="maxTime" min="30" value="30" disabled>
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
    const gameBar = document.querySelector('.gameButtonbar')
    gameBar.style.display = 'none';
    gameScreen.innerHTML = menuHtml;

    return new Promise(resolve => {
        const configForm = document.getElementById('configForm');
        
        const timeTrialCheck = document.getElementById('timeTrialCheck')
        const maxTimeInput = document.getElementById('maxTime');

        //Aca se desbilita o habilita el input del tiempo, para que no se rompa nada y anden los dos modos.
        timeTrialCheck.addEventListener('change', () =>{
                maxTimeInput.disabled = !timeTrialCheck.checked;
        });

        configForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isTimeTrial = document.getElementById('timeTrialCheck').checked;
            const timeValue = parseInt(document.getElementById('maxTime').value);

            const selectedConfig = {
                piecesCount: parseInt(document.getElementById('piecesCount').value),
                maxTime: isTimeTrial ? Math.max(30, timeValue) : 0,
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

function prepareGame(selectedConfig, img, onLevelComplete){
    const gameContainer = document.getElementById('gameScreen');
    const gameBar = document.querySelector('.gameButtonbar')
    gameContainer.innerHTML = `
    <canvas id="miCanvas"></canvas>
    `;
    gameBar.style.display = '';
    const pieces = selectedConfig.piecesCount;

    playGame(pieces, img, onLevelComplete)
}



function playGame(pieces, imagenUrl, onLevelComplete){

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
                    rotation: Math.floor(Math.random() * 4) * 90 // Rotación inicial aleatoria (0, 90, 180, 270)
                });

            }
        }

        drawPuzzle(ctx, imagen, anchoPieza, altoPieza, COLUMNAS, FILAS);
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
                drawPuzzle(ctx, imagen, anchoPieza, altoPieza);

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

function isCompleted(){
     return puzzlePieces.every(piece => (piece.rotation % 360)===0);
}


function drawPuzzle(ctx, imagen, anchoPieza, altoPieza) {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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