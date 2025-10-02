const loaderScreen = document.getElementById('loader-screen');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');

const DURATION = 5000;
const INTERVAL = 50;
const totalSteps = DURATION / INTERVAL;
let currentStep = 0;

export function simulateProgress() {
    const interval = setInterval(() => {
        currentStep++;

        const progressPercentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));

        progressBarFill.style.width = `${progressPercentage}%`;

        progressText.textContent = `${progressPercentage}%`;

        if (currentStep >= totalSteps) {
            clearInterval(interval);
            setTimeout(hideLoader, 200); 
        }
    }, INTERVAL);
}

function hideLoader() {
    loaderScreen.classList.add('hidden');
    setTimeout(() => {
        loaderScreen.remove();
    }, 500); 
}