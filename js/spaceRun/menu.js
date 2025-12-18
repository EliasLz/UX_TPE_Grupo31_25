
const gameScreen = document.getElementById('gameScreen');

export function showMenu() {

    const menuWrapper = document.createElement('div');

    menuWrapper.className = 'menu-wrapper';
    menuWrapper.innerHTML = `
            <h2>SpaceRun</h2>
            <form id="menuForm">
                <div class="menu-option">
                    <h3> Seleccione la nave espacial: </h3>
                    <label class="picker">
                        <img src="assets/spaceRun/spaceship.png" alt="Tablero">
                        <input type="radio" name="spaceship" value="1" required checked>
                    </label>

                    <label class="picker">
                        <img src="assets/spaceRun/spaceship2.png" alt="Tablero">
                        <input type="radio" name="spaceship" value="2">
                    </label>
                </div>
                <button type="submit" id="startGameBtn"> Iniciar Juego </button>
            </form>
    `;



    gameScreen.appendChild(menuWrapper);

    return new Promise( resolve => {
        const config = menuWrapper.querySelector('#menuForm');

        config.addEventListener('submit', (e)=>{
            e.preventDefault();

            const formData = new FormData(config);
            const spaceshipChoice = formData.get('spaceship');
            resolve({
                spaceshipChoice: parseInt(spaceshipChoice)
            })
        })
    })

}

export function showCurrentRecord(score) {

    const currentRecord = document.createElement('div');
    currentRecord.className = 'current-record';
    const scoreText = document.createElement('h3');
    scoreText.textContent = `TU RECORD: ${score}`;
    currentRecord.appendChild(scoreText);
    const menuWrapper = gameScreen.querySelector('.menu-wrapper');
    menuWrapper.prepend(currentRecord);
}

export function hiddenMenu() {
    const menuWrapper = gameScreen.querySelector('.menu-wrapper');
    gameScreen.removeChild(menuWrapper);
}