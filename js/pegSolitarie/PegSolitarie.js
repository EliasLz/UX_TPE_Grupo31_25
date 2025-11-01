let canvas = document.getElementById('prueba');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let dashboard = new Dashboard(canvasWidth, canvasHeight);
//let timer = new Timer();

    //Prepara el juego (Armado del tablero, Colocar piezas, Canvas, etc)
    function init(){
        console.log("atroden")
        dashboard.draw(ctx);
        //timer.draw();
    }









    function play(){}//Logica del juego (Bucle, etc)
    function end(){}//Finalizador del juego(Mostrar resultados, reset del talblero, etc)
    //Jugabilidad Drag & Drop
    function onMouseDown(e){}//Se presiona el click
    function onMouseUp(e){}//Se suelta el click
    function onMouseMove(e){}//Se mantiene el click

    console.log("soy init",init)
    document.addEventListener('DOMContentLoaded', init);

