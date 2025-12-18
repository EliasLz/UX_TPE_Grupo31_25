//import { Collision } from './Collision.js';
import { Space } from './Space.js';
import { showMenu, showCurrentRecord, hiddenMenu } from './menu.js';
import { insertParallax, startMoveParallax, resetParallax } from './parallax/parallax.js';

const keysPressed = {
    w: false,
    'shift': false
};

const gameContainer = document.getElementById('gameScreen');
let space = null;
let currentScoreRecord = 0;

export function ejecutionSpaceRun() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage != 'game3.html') {
        return;
    }
    const playButton = document.getElementById('playButton');

    playButton.addEventListener('click', () => {
        gameContainer.innerHTML = " ";
        insertParallax(gameContainer);
        init();
        playButton.style.display = 'none';
    });
}

export async function init() {
    const config = await showMenu();
    
    
    if (currentScoreRecord > 0) {
        showCurrentRecord(currentScoreRecord);
    }

    hiddenMenu();
    playGame( config);
    

}

export function playGame(config) {
    if (currentScoreRecord == 0) {
        startMoveParallax();
    } else {
        resetParallax();
    }
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    
    space = new Space(gameContainer, config.spaceshipChoice);
    startGame();
}

function startGame() {

    if (keysPressed.w) {
        space.spaceshipMoveUp();
    } else {
        space.spaceshipMoveDown();
    }

    space.checkCollisions();

    if (space.update() || space.spaceship.hp <= 1) {
        startMoveParallax();
        setTimeout(() => {
            if (currentScoreRecord < space.currentScore) {
                currentScoreRecord = space.currentScore;
            }
            space.destroy();
            init();
        }, 1000);
        return;
    }

    requestAnimationFrame(startGame);
}

function keyDown(e) {
    const key = e.key.toLowerCase();

    if (key === 'w') {
        keysPressed[key] = true;
    }

    if (key === 'shift') {
        space.spaceshipShoot();
        keysPressed['shift'] = true;
    }
}

function keyUp(e) {
    const key = e.key.toLowerCase();

    if (key === 'w') {
        keysPressed[key] = false;
    }

    if (key === 'shift') {
        keysPressed['shift'] = false;
    }
}

