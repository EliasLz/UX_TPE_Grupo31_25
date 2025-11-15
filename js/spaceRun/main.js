//import { Collision } from './Collision.js';
import { Space } from './Space.js';
import { Spaceship } from './Spaceship.js';

let points = 0;
let gameSpeed = 5;
//let spaceship = null;
//let space = null;

export function init(){
    const playButton = '';

    //playButton.addEventListener('click', ()=>{
        playGame();
    //})
}

export function playGame(){
    const gameContainer = document.getElementById('gameContainer')
    const spaceship = document.getElementById('player')
    
    const space = new Space(gameContainer);
    console.log(space)
    
    function elementMove(){
        space.update();
    
        requestAnimationFrame(elementMove);
    }

    elementMove();
}

init()