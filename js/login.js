let respuestaCorrecta; 


const login = document.getElementById('login');
const register = document.getElementById('register');
const welcome = document.getElementById('welcome');

// Función para generar una pregunta de seguridad aleatoria
function generarPreguntaSeguridad() {
    let pregunta = document.getElementById('captcha-question');

    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;  

    respuestaCorrecta = num1 + num2;

    pregunta.textContent = `¿Cuánto es ${num1} + ${num2}?`;

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
        return true;
    } else {
        mensaje.textContent = "Respuesta incorrecta. Por favor, inténtalo de nuevo. ❌";
        mensaje.classList.add('message-error');
        return false;
    }
}

function resetMessage(){

    validarRespuesta();

    const botonCaptcha = document.getElementById('button-submit');
    botonCaptcha.disabled = true;
    
    const inputCaptcha = document.querySelector('#captcha-answer');
    inputCaptcha.disabled = true;

    //Esperamos 1000 milisegundos (1 segundos)
    setTimeout(() => {
        
        if(!validarRespuesta()){
            generarPreguntaSeguridad();
            botonCaptcha.disabled = false; 
            inputCaptcha.disabled = false; 
            return; 
        } else {
            botonCaptcha.disabled = false; 
            inputCaptcha.disabled = false; 
            register.classList.toggle('hiden');
            welcome.classList.toggle('hiden');
            initRedirection();
            }
    }, 1000); // 
    
    return;

};

// Controlamos el boton registro
botonRegistro = document.getElementById('button-register');
botonRegistro.addEventListener('click', function(e){
    e.preventDefault();
    generarPreguntaSeguridad();
    login.classList.toggle('hiden');
    register.classList.toggle('hiden');

})

// Controlamos el boton volver
const botonesVolver = document.querySelectorAll('#button-back');
    botonesVolver.forEach(boton => {
        boton.addEventListener('click', function(e){
            e.preventDefault();

            if(!register.classList.contains('hiden')){
                register.classList.toggle('hiden');
                login.classList.toggle('hiden');
            }
        })
    }
);


// controlamos el boton enviar formulario
const submitForm = document.getElementById('form-register');
submitForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    resetMessage();
})


// El usuario navega hacia el home.html
document.getElementById('searchForm').addEventListener('submit', navhome);
document.getElementById('button-facebook').addEventListener('click', navhome);
document.getElementById('button-google').addEventListener('click', navhome);
//Redireccionamiento al home.html
function initRedirection(){
    const countDownContainer = document.getElementById('countDown');

    if(!countDownContainer) return;

    countDownContainer.innerHTML = 'Redirigiendo al inicio<span id="dots"></span>' //--> Aqui insertaremos los puntos suspensivos.
    const dotsElement = document.getElementById('dots');

    let dotsCount = 0;
    let intervalId;

    function animateDots(){
        dotsCount = (dotsCount + 1) % 4; // Ciclo entre 0, 1, 2, 3 puntos

        let dots = '';
        for(let i = 0; i < dotsCount; i++){
            dots += '.';
        }
        dotsElement.textContent = dots;
    }

    intervalId = setInterval(animateDots, 500);

    setTimeout(() => {
        clearInterval(intervalId);
        countDownContainer.textContent = 'Redireccion completada. ¡Bienvenido!';
        setTimeout(() => {
            window.location.href = '/home.html';
        }, 1000);
    }, 4000)
}


function navhome(e){
    e.preventDefault();
    window.location.href = "home.html"
}
