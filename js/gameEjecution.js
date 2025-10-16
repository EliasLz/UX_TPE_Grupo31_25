const GAME_DEFAULTS = {
    piecesCount: 4,
    maxTime: 0,          // 0 para sin límite, > 0 para límite en segundos
    useHelp: false
};

const IMAGE_BANK = [
    'imgBlocka/Loro.png', 
    'imgBlocka/Panda.jpg', 
    'imgBlocka/Pollo.png',
    'imgBlocka/Tigre.png',
    'imgBlocka/Zorro.png',
    'imgBlocka/Puma.jpg',
];

export function ejecution() {
    const playButton = document.getElementById('playButton');

    playButton.addEventListener('click', async ()=>{
        //gameContainer.innerHTML = '<h2>Cargando juego...</h2>'; //TODO:: Hacer una animacion.
        playButton.style.display = 'none';
        const gameConfig = await configureGame();
        startGame(gameConfig);
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

function prepareGame(pieces){
    let piecesHTML = [];

    for(let i = 0; i < pieces; i++){
        piecesHTML.push(`<div id="piece img-${i+1}" class="blocka-pieza" data-posicion=""></div>`);
    }
    
    const gameHTML = `        
        <div id="blocka-game">
            <h2>Nivel <span id="level">1</span></h2>
            <div id="contain-pieces" class="grid-${pieces/2}x2">
                ${piecesHTML.join('')}
            </div>
            <div id="status-message" class="hidden">¡Felicidades, Blocka Resuelta!</div>
            <button id="btn-next" class="hidden">Siguiente Nivel</button>
        </div>
    `;

    loadImg(pieces);

    return gameHTML;
}

function loadImg(pieces){
    const imageUrl = IMAGE_BANK[Math.floor(Math.random() * IMAGE_BANK.length)];
    let contains_pieces = document.querySelectorAll('#piece');

    contains_pieces.forEach(piece =>{
        piece.style.backgroundImage =`url('${imagenUrl}')`;
        piece.setAttribute('data-posicion','');
    })
    
}





