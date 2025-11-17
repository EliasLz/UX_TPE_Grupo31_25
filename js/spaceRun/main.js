//import { Collision } from './Collision.js';
import { Space } from './Space.js';

const keysPressed = {
    w: false,
    s: false,
    ' ': false // Barra espaciadora.
};

const gameContainer = document.getElementById('gameContainer');
const space = new Space(gameContainer);


export function init(){
    const playButton = '';

    //playButton.addEventListener('click', ()=>{
        playGame();
    //})
}

export function playGame(){

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    
    startGame();
}

function startGame(){

    if(keysPressed.w){
        space.spaceshipMoveUp();
    }
    if(keysPressed.s){
        space.spaceshipMoveDown();
    }
    
    space.checkCollisions();
    if (space.spaceship.hp <= 0) {
        alert("Perdiste!!");
        return;
    }

    space.update();
    
    requestAnimationFrame(startGame);
}

function keyDown(e){
    const key = e.key.toLowerCase();
    
    if(key === 'w' || key === 's'){
        console.log("toque el boton: ",key)
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