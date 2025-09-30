// Variable global para almacenar la respuesta correcta
let respuestaCorrecta; 


const login = document.getElementById('login');
const captcha = document.getElementById('captcha');
const register = document.getElementById('register');
const welcome = document.getElementById('welcome');

// Función para generar una pregunta de seguridad aleatoria
function generarPreguntaSeguridad() {
    let pregunta = document.getElementById('captcha-question');

    // Generar dos números aleatorios entre 1 y 10
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;  

    // Calcular la respuesta correcta
    respuestaCorrecta = num1 + num2;

    //Mostrar pregunta
    pregunta.textContent = `¿Cuánto es ${num1} + ${num2}?`;

    // Limpiar campos
    document.getElementById('captcha-answer').value = '';
    document.getElementById('captcha-message').className = 'message-hidden';
}


// Validar respuesta
function validarRespuesta() {
    let respuestaUsuario = parseInt(document.getElementById('captcha-answer').value);
    let mensaje = document.getElementById('captcha-message');
    
    if(respuestaUsuario === respuestaCorrecta){
        mensaje.textContent = "¡Verificación exitosa! ✅";
        mensaje.classList.add('message-success');
        return true; //Captcha correcto
    } else {
        mensaje.textContent = "Respuesta incorrecta. Por favor, inténtalo de nuevo. ❌";
        mensaje.classList.add('message-error');
        return false;
    }
}

// Controlamos el envio del formulario
document.addEventListener('DOMContentLoaded', function() {
    //generamos captcha
    generarPreguntaSeguridad();

    // Capturamos el evento del fornmulario
    document.addEventListener('submit', function(e){
        e.preventDefault(); // Prevenimos el envio del formulario
        formCaptcha = document.getElementById('pre-captcha-form');

        validarRespuesta();

            // Deshabilitamos el botón mientras esperamos para evitar doble clic
            const botonCaptcha = document.getElementById('buttom-captcha');
            botonCaptcha.disabled = true;

            // Deshabolitamos el input para evitar cambios mientras esperamos
            const inputCaptcha = formCaptcha.querySelector('#captcha-answer');
            inputCaptcha.disabled = true;

            //Esperamos 1000 milisegundos (1 segundos)
            setTimeout(() => {
                // Código que se ejecuta DESPUÉS de 1 segundos:
                
                if(!validarRespuesta()){
                    generarPreguntaSeguridad();
                    botonCaptcha.disabled = false; // Rehabilitamos el botón
                    inputCaptcha.disabled = false; // Rehabilitamos el input
                    return; // Salimos de la función si la respuesta es incorrecta
                } else {
                    botonCaptcha.disabled = false; // Rehabilitamos el botón
                    inputCaptcha.disabled = false; // Rehabilitamos el input
                    captcha.classList.toggle('hiden');
                    register.classList.toggle('hiden');
                    }
            }, 1000); // 
            
            return;

    });
});


// Controlamos el boton registro
botonRegistro = document.getElementById('button-register');
botonRegistro.addEventListener('click', function(e){
    e.preventDefault();

    login.classList.toggle('hiden');
    captcha.classList.toggle('hiden');

})

// Controlamos el boton volver
const botonesVolver = document.querySelectorAll('#button-back');
botonesVolver.forEach(boton => {
    boton.addEventListener('click', function(e){
        e.preventDefault();

        if(!captcha.classList.contains('hiden')){
            captcha.classList.toggle('hiden');
            login.classList.toggle('hiden');
        } else if(!register.classList.contains('hiden')){
            register.classList.toggle('hiden');
            captcha.classList.toggle('hiden');
            generarPreguntaSeguridad(); // Regeneramos la pregunta al volver
        }
    })});