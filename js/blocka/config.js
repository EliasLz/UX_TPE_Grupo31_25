export const GAME_DEFAULTS = {
    piecesCount: 4,
    maxTime: 0,          // 0 para sin límite, > 0 para límite en segundos
    useHelp: false
};

export const IMAGE_ANIMAL = [
    'assets/img-Blocka/animals/Loro.png', 
    'assets/img-Blocka/animals/Panda.jpg', 
    'assets/img-Blocka/animals/Pollo.png',
    'assets/img-Blocka/animals/Tigre.png',
    'assets/img-Blocka/animals/Zorro.png',
    'assets/img-Blocka/animals/Puma.jpg',
];

export const IMAGE_AUTO = [
    'assets/img-Blocka/autos/auto-Amarillo.png', 
    'assets/img-Blocka/autos/auto-Azul.png', 
    'assets/img-Blocka/autos/auto-Gris.png',
    'assets/img-Blocka/autos/camion.png',
    'assets/img-Blocka/autos/camioneta.png',
    'assets/img-Blocka/autos/formula1.png',
];
export const IMAGE_MARAVILLA = [
    'assets/img-Blocka/maravillas/cataratas-Misiones.png', 
    'assets/img-Blocka/maravillas/chichenitza.png', 
    'assets/img-Blocka/maravillas/coliceo.png',
    'assets/img-Blocka/maravillas/machupichu.png',
    'assets/img-Blocka/maravillas/muralla-China.png',
    'assets/img-Blocka/maravillas/templo.png',
];

export function configureGame() {
    const gameScreen = document.getElementById('gameScreen');
    
    const menuHtml = `
            <div class="config-menu">
                <h1>MENU</h1>
                <form id="configForm">
                    <div class="config-option">
                        <h3 for="piecesCount" style="padding:10px">Dificultad</h3>
                        <select id="piecesCount" name="piecesCount">
                            <option value="2" selected>4 Piezas (2x2) - Fácil</option>
                            <option value="3">9 Piezas (3x3) - Medio</option> 
                            <option value="4">16 Piezas (4x4) - Difícil</option>
                        </select>
                    </div>

                    <div>
                        
                        <div class="config-option">
                            <h3 for="timeTrialCheck">Tiempo</h3>
                            <h5 for="maxTime">Habilitar Modo Contrareloj</h5>
                            <div  style="display: flex; align-items: center; gap: 10px;">
                                <label class="toggle-container">
                                    <input type="checkbox" id="timeTrialCheck" name="timeTrialCheck"/>
                                    <span class="toggle-slider"></span>
                                </label>
                                <input type="number" id="maxTime" name="maxTime" min="30"  placeholder="Tiempo (min 30s)"  disabled>
                            </div>
                            <p>El juego termina si el tiempo se agota.</p>
                        </div>
                    </div>

                    <div class="config-option">
                        <h3 for="useHelp" style="color:black" >Ayuda</h3>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <label class="toggle-container">
                                <input type="checkbox" id="useHelp" name="useHelp"/>
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">Habilitar "Ayudita" (5 segundos de penalización por uso).</span>
                            </label>
                        </div>
                    </div>

                    <div class="config-option">
                        <h3 for="useHelp" style="color:black" >Tematica</h3>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <label class="toggle-container-theme">
                                <span class="toggle-label">Animales</span>
                                <input type="radio" name="theme" id="useHelp" name="useHelp" value="1" checked/>
                                <span class="toggle-slider"></span>
                            </label>
                            <label class="toggle-container-theme">
                                <span class="toggle-label">Automoviles</span>
                                <input type="radio" name="theme" id="useHelp" name="useHelp" value="2"/>
                                <span class="toggle-slider"></span>
                            </label>
                            <label class="toggle-container-theme">
                                <span class="toggle-label">Maravillas</span>
                                <input type="radio" name="theme" id="useHelp" name="useHelp" value="3"/>
                                <span class="toggle-slider"></span>
                            </label>
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
            let timeValue = parseInt(document.getElementById('maxTime').value);

            // Si el usuario no ingresa un valor, por defecto es 30s
            if (isTimeTrial && (isNaN(timeValue))) {
                timeValue = 30; 
            }

            // Obtenemos la tematica seleccionada
            let selectedTheme = 'animals'; // Valor por defecto
            selectedTheme = document.querySelector('input[name="theme"]:checked').value;
            
            const selectedConfig = {
                piecesCount: parseInt(document.getElementById('piecesCount').value),
                maxTime: isTimeTrial ? Math.max(30, timeValue) : 0,
                useHelp: document.getElementById('useHelp').checked,
                theme : selectedTheme
            };

            // por qué el elemento "configOverlay" no está en ninguna otra parte del codigo? que selecciona?
            const overlay = document.getElementById('configOverlay');
            if (overlay) {
                overlay.remove();
            }

            resolve(selectedConfig);
        });
    });
}