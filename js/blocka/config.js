export const GAME_DEFAULTS = {
    piecesCount: 4,
    maxTime: 0,          // 0 para sin límite, > 0 para límite en segundos
    useHelp: false
};

export const IMAGE_BANK = [
    'assets/img-Blocka/Loro.png', 
    'assets/img-Blocka/Panda.jpg', 
    'assets/img-Blocka/Pollo.png',
    'assets/img-Blocka/Tigre.png',
    'assets/img-Blocka/Zorro.png',
    'assets/img-Blocka/Puma.jpg',
];

export function configureGame() {
    const gameScreen = document.getElementById('gameScreen');
    
    const menuHtml = `
            <div class="config-menu">
                <h1 style="font-weight: 900;" >Configuración del Nivel</h1>
                <form id="configForm">
                    <div class="config-option">
                        <h3 for="piecesCount" style="padding:10px">DIFICULTAD</h3>
                        <select id="piecesCount" name="piecesCount">
                            <option value="4" selected>4 Piezas (2x2) - Fácil</option>
                            <option value="6">6 Piezas (3x2) - Medio</option> 
                            <option value="8">8 Piezas (4x2) - Difícil</option>
                        </select>
                    </div>

                    <div>
                        
                        <div class="config-option">
                            <h3 for="timeTrialCheck">Tiempo</h3>
                            <h5 for="maxTime">Habilitar Modo Contrareloj</h5>
                            <div  style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="timeTrialCheck" name="timeTrialCheck" style="margin-right: 10px;">
                                <input type="number" id="maxTime" name="maxTime" min="30"  placeholder="Tiempo (min 30s)"  disabled>
                            </div>
                            <small>El juego termina si el tiempo se agota.</small>
                        </div>
                    </div>

                    <div class="config-option">
                        <h3 for="useHelp" style="color:black" >Ayuda</h3>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div for="useHelp" class="switch">
                                <input type="checkbox" class="" id="useHelp" name="useHelp">
                                <span class="slider round"></span>
                            </div>
                            <label>Habilitar "Ayudita" (+5 segundos de penalización por uso).</label>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button type="submit" class="btn-game">COMENZAR JUEGO</button>
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