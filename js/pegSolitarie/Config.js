import { formatTime } from '../blocka/utils.js'
import { init } from './PegSolitarie.js'

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
            <h1> Peg Solitarie </h1>
            <form id="configForm"> 
            
                <div class="config-option">
                    <h3> Seleccione una pieza </h3>
                    <div class="config-option-img">
                        <label class="picker">
                            <img src="assets/img-Peg-Solitarie/Rosca.png" alt="Rosca">
                            <input type="radio" name="pieza" value="1" required>
                        </label>

                        <label class="picker">
                            <img src="assets/img-Peg-Solitarie/Duff.png" alt="Duff">
                            <input type="radio" name="pieza" value="2">
                        </label>
                    </div>
                </div>
                
                <div class="config-option">
                    <h3> Seleccione la forma del tablero </h3>
                    <div class="config-option-img">
                        <label class="picker">
                            <img src="assets/img-Peg-Solitarie/peg-Clasico.png" alt="Tablero">
                            <input type="radio" name="tablero" value="1" required>
                        </label>

                        <label class="picker">
                            <img src="assets/img-Peg-Solitarie/peg-Cuadrado.png" alt="Tablero">
                            <input type="radio" name="tablero" value="2">
                        </label>
                    </div>
                </div>


                <div class="config-option">
                    <h3> Modo desafio </h3>
                    <label class="toggle-container">
                        <input type="checkbox" id="challengeModeCheck" name="challengeModeCheck"/>
                        <span class="toggle-slider"></span>
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
                        <input type="number" id="maxTime" name="maxTime" min="5"  placeholder="Tiempo (min 30s)"  disabled>
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
            const isChallengeMode = document.getElementById('challengeModeCheck').checked;
            let timeValue = parseInt(document.getElementById('maxTime').value)

            let selectedPiece;
            let selectedBoard;

            if(document.querySelector('input[name="pieza"]:checked').value == 1){
                selectedPiece = PIECE_IMG[0];
            } else {
                selectedPiece = PIECE_IMG[1];
            }

            selectedBoard = document.querySelector('input[name="tablero"]:checked').value;
  

            if (isTimeTrial && (isNaN(timeValue))) {
                timeValue = 30; 
            }

            const selectedConfig = {
                selectedPiece : selectedPiece,
                maxTime : isTimeTrial ? timeValue : 0,
                isTimeTrial : isTimeTrial,
                selectedBoard : selectedBoard,
                challengeMode : isChallengeMode
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
        res = 'Felicitacion, usted a ganado el juego';
    }else{
        res = 'Upss, has perdido';
    }

    const menuHtml = `
    <div class="config-menu">
        <h2> Peg Solitarie </h2>
        <p>${res} </p>
        <p> Tiempo: ${formatTime(time)} </p>
        <button id="restart" class="btn-Menu-game" > Reiniciar </button>
    </div>
        ` 
    gameScreen.innerHTML = menuHtml;

    document.getElementById('restart').addEventListener('click',init)
}

