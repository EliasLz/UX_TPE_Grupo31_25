



export function showMenu(){

    const gameScreen = document.getElementById('gameScreen');
    // o "game3Backgroud"
    const game3Stage = document.createElement('div');
    game3Stage.id = 'game3Stage'


    game3Stage.innerHTML = `
            <div class="layer layer-4"></div>
            <div class="layer layer-3"></div>
            <div class="layer layer-2"></div>
            <div class="layer layer-1"></div>
    `
    gameScreen.appendChild(game3Stage)



    
}