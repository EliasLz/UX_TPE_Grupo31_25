//import { Collision } from './Collision.js';
import { Space } from './Space.js';
import { showMenu, hiddenMenu } from './menu.js';

const keysPressed = {
    w: false,
    s: false,
    ' ': false // Barra espaciadora.
};

const gameContainer = document.getElementById('gameContainer');
let space = null;


export function init(){
    let playButton = '';
    showMenu();
    
    playButton = document.getElementById('startGameBtn');
    playButton.addEventListener('click', ()=>{
        console.log("inicia juyego")
        hiddenMenu();
        playGame();
    });
    
}

export function playGame(){
    
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    
    space= new Space(gameContainer);
    startGame();
}

function startGame(){

    if(keysPressed.w){
        space.spaceshipMoveUp();
    }
    if(keysPressed.s){
        space.spaceshipMoveDown();
    }
    space.update();
    
    space.checkCollisions();
    if (space.spaceship.hp <= 0) {

        //hay que destruir todos los div creados y reiniciar el juego
        space.destroy();
        init();
        return;
    }

    
    requestAnimationFrame(startGame);
}

function keyDown(e){
    const key = e.key.toLowerCase();
    
    if(key === 'w' || key === 's'){
        keysPressed[key] = true;
        e.preventDefault();
    }
    
    if(key === ' ' && !keysPressed[' ']){
        space.spaceshipShoot();
        keysPressed[' '] = true;
        e.preventDefault();
    }
}

function keyUp(e){
    const key = e.key.toLowerCase();

    if(key === 'w' || key === 's'){
        keysPressed[key] = false;
    }

    if(key === ' '){
        keysPressed[' '] = false;
    }
}


init()