//Se implementa el metodo Fisher-Yates shuffle que es el mas eficiente para hacer esto.
export function randomOrder(arrImgs){
    const rdmOrder = [...arrImgs];

    for (let i = rdmOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rdmOrder[i], rdmOrder[j]] = [rdmOrder[j], rdmOrder[i]];
    }

    return rdmOrder;
}

//Formateamos el tiempo para que se vea mejor. (MM:SS)
export function formatTime(totalSeconds){
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}