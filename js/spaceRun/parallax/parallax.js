


export function insertParallax(gameArea){
    const parallax = document.createElement('div');
    parallax.className = "parallax";

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