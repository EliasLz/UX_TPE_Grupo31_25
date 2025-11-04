
const PIECE_IMG = [
    'assets/img-Peg-Solitarie/Rosca.png',
    'assets/img-Peg-Solitarie/Duff.png'
]

export function showMenu(){

    const gameScreen = document.getElementById('gameScreen');
    const menuWrapper = document.createElement('div');
    menuWrapper.id = 'menu-wrapper'


    menuWrapper.innerHTML = `
        <div class="config-menu">
            <h2> Peg Solitarie </h2>
            <form id="configForm"> 
            <label> Seleccione una pieza </label>
                <div class="config-option-img">
                    <label class="picker">
                        <input type="radio" name="pieza" value="1" required>
                        <img src="assets/img-Peg-Solitarie/Rosca.png" alt="Rosca">
                    </label>

                    <label class="picker">
                        <input type="radio" name="pieza" value="2">
                        <img src="assets/img-Peg-Solitarie/Duff.png" alt="Duff">
                    </label>
                </div>
                
                <div class="config-option">
                    <h3 for="timeTrialCheck">TIEMPO</h3>
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
                <button id="play" class="btn-Menu-game" > Jugar </button>
            </form> 
        </div>
    `
    
    gameScreen.appendChild(menuWrapper)
    gameScreen.className='game2Background';
    
    return new Promise(resolve =>{
        const configForm = menuWrapper.querySelector('#configForm');
        const timeTrialCheck = menuWrapper.querySelector('#timeTrialCheck');
        const maxTime = menuWrapper.querySelector('#maxTime');

        timeTrialCheck.addEventListener('change', () =>{
            maxTime.disabled = !timeTrialCheck.checked;
        });

        configForm.addEventListener('submit', (e)=>{
            e.preventDefault();

            const isTimeTrial = document.getElementById('timeTrialCheck').checked;
            let timeValue = parseInt(document.getElementById('maxTime').value)

            let selectedPiece;

            if(document.querySelector('input[name="pieza"]:checked').value == 1){
                selectedPiece = PIECE_IMG[0];
            } else {
                selectedPiece = PIECE_IMG[1];
            }

            if (isTimeTrial && (isNaN(timeValue))) {
                timeValue = 30; 
            }

            const selectedConfig = {
                selectedPiece : selectedPiece,
                maxTime : isTimeTrial ? timeValue : 0   
            }

            gameScreen.removeChild(menuWrapper);

            resolve (selectedConfig);
        })
    });
}

export function showEndMenu(gameOver, time){
    const gameScreen = document.getElementById('gameScreen');
    let res;

    if(gameOver){
        res = 'Usted Gano';
    }else{
        res = 'Usted Perdio';
    }

    const menuHtml = `
        <h2> Peg Solitarie </h2>
        <p>${result}} </p>
        <p> Tiempo: ${time}} </p>
        <button id="restart" class="btn-Menu-game" > Reiniciar </button>
    `
    gameScreen.innerHTML = menuHtml;
}

