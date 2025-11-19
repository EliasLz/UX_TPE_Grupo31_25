
const gameScreen = document.getElementById('gameScreen');

export function showMenu(){

    const menuWrapper = document.createElement('div');

    menuWrapper.className = 'menu-wrapper';
    menuWrapper.innerHTML = `
            <h2>SpaceRun</h2>
            <button id="startGameBtn"> Iniciar Juego </button>
    `;

    gameScreen.appendChild(menuWrapper);
}

export function hiddenMenu(){
    const menuWrapper = gameScreen.querySelector('.menu-wrapper');

    gameScreen.removeChild(menuWrapper);
}