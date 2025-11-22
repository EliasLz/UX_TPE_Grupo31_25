//import { Collision } from './Collision.js';
import { Space } from './Space.js';
import { showMenu, hiddenMenu } from './menu.js';
import { insertParallax } from './parallax/parallax.js';

const keysPressed = {
    w: false,
    ' ': false // Barra espaciadora.
};

const gameContainer = document.getElementById('gameScreen');
let space = null;

export function ejecutionSpaceRun() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if(currentPage != 'game3.html'){
        return;
    }
    const playButton = document.getElementById('playButton');
    
    playButton.addEventListener('click',  ()=>{
        gameContainer.innerHTML = " ";
        insertParallax(gameContainer);
        
        init();
        playButton.style.display = 'none';
    });
}

export function init(){
    showMenu();
    
    let playButton = document.getElementById('startGameBtn');
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
    } else {
        space.spaceshipMoveDown();
    }

    space.checkCollisions();

    if (space.update() || space.spaceship.hp <= 1) {
        setTimeout( ()=>{
            space.destroy();
            init();
        } , 1000);
        return;
    }

    
    requestAnimationFrame(startGame);
}

function keyDown(e){
    const key = e.key.toLowerCase();
    
    if(key === 'w'){
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

    if(key === 'w'){
        keysPressed[key] = false;
    }

    if(key === ' '){
        keysPressed[' '] = false;
    }
}

