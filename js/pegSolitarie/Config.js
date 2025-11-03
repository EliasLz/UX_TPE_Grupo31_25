
const PIECE_URL = [
    'assets/img-Peg-Solitarie/Rosca.png',
    'assets/img-Peg-Solitarie/Duff.png'
]

export function showMenu(){

    const gameScreen = document.getElementById('gameScreen');

    const menuHtml = `
        <div>
            <h2> Peg Solitarie </h2>
            <form> 
                <label> Seleccione una pieza </label>
                <select id="piecesImage">
                <options value="1"> <img url="${PIECE_URL[0]}"></options> 
                <options value="2"> <img url="${PIECE_URL[1]}"></options> 
                </select>
                
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
            </form> 
            <button id="play" class="btn-Menu-game" > Jugar </button>
        </div>
    `

    gameScreen.innerHTML = menuHtml;
    return new Promise(resolve =>{
        
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

