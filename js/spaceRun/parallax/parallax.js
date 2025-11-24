


export function insertParallax(gameArea) {

    const parallax = document.createElement('div');
    parallax.className = "parallax";
    parallax.classList.add('pausedAnimation');

    parallax.innerHTML = `
        <div class="layer layer-10"></div>     
        <div class="layer layer-9"></div>
        <div class="layer layer-8"></div>
        <div class="layer layer-7"></div>
        <div class="layer layer-6"></div>
        <div class="layer layer-5"></div>
        <div class="layer layer-4"></div>
        <div class="layer layer-3"></div>
        <div class="layer layer-2"></div>
        <div class="layer layer-1"></div>
    `;
    gameArea.appendChild(parallax);
}

export function startMoveParallax() {
    const layers = document.querySelectorAll('.layer');

    // Quitamos el paused todas las capas del parallax
    layers.forEach(layer => {
        layer.classList.remove('resetPositions');

        layer.classList.toggle('startAnimations');
    });
}

export function resetParallax() {
    const layers = document.querySelectorAll('.layer');

    // Quitamos las animaciones de cada layer y las volvermos aplicar para resetear su posicion
    layers.forEach(layer => {
        layer.classList.toggle('resetPositions');
        layer.offsetHeight; 
        layer.classList.toggle('resetPositions');
        layer.classList.toggle('startAnimations');
    });
}