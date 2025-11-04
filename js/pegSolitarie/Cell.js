export class Cell {
    constructor(x, y, width, height, ctx) {
        this.x = x;
        this.y = y;
        this.baseWidth = width;
        this.baseHeight = height;
        this.ctx = ctx;

        this.isEmpty = true;
        this.highlighted = false;

        // --- variables de la animación ---
        this.pulseActive = false;   // está pulsando?
        this.pulseScale = 0;        // 0 → sin escalar, 1 → tamaño máximo
        this.pulseSpeed = 0.006;     // qué tan rápido crece/encoge (ajusta a gusto)
        this.pulseMax = 0.12;       // % de crecimiento máximo (0.12 = 12 %)
    }

    // empieza la animación
    startPulse() {
        this.pulseActive = true;
        this.pulseScale = 0;
        
    }

    // para la animación  
    stopPulse() {
        this.pulseActive = false;
        this.pulseScale = 0;
    }

    //  Se llama desde tu game-loop 
    draw() {
        this.updatePulse();// actualiza la animación
        this.paint();      // dibuja la celda con el escalado actual
    }

    // Lógica del “respirar” 
    updatePulse() {
        if (!this.pulseActive) return;

        this.pulseScale += this.pulseSpeed;
        if (this.pulseScale >= 1) {
        this.pulseScale = 1;
        this.pulseSpeed *= -1;   // invertimos dirección (crecer → encoger)
        } else if (this.pulseScale <= 0) {
        this.pulseScale = 0;
        this.pulseSpeed *= -1;   // invertimos dirección (encoger → crecer)
        }
    }

    // Dibujado 
    paint() {
        const scale = this.pulseActive ? this.pulseScale * this.pulseMax : 0;
        const w = this.baseWidth * (1 + scale);
        const h = this.baseHeight * (1 + scale);
        const offsetX = (w - this.baseWidth) / 2;
        const offsetY = (h - this.baseHeight) / 2;

        // color según estado
        this.ctx.fillStyle = this.highlighted || this.pulseActive ? 'rgba(37, 164, 35, 0.5)' : '#ff7b0077';

        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 5;

        this.ctx.strokeRect(this.x - offsetX, this.y - offsetY, w, h);
        this.ctx.fillRect( this.x - offsetX, this.y - offsetY, w, h);

    }

    isPointInside(x, y) {
        return !(x < this.x || x > this.x + this.baseWidth || y < this.y || y > this.y + this.baseHeight);
    }

    setResaltada(highlighted) {
        this.highlighted = highlighted; 
    }

    isValid() {
        return this.isEmpty; 
    }

    setEmpty() { 
        this.isEmpty = true; 
    }

    setOccupied() { 
        this.isEmpty = false; 
    }
}