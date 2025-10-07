let respuestaCorrecta; 


const login = document.getElementById('login');
const captcha = document.getElementById('captcha');
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

const captchaForm =  document.getElementById('pre-captcha-form');
captchaForm.addEventListener('submit', (e)=>{    
    e.preventDefault();
    formCaptcha = document.getElementById('pre-captcha-form');

    validarRespuesta();

    const botonCaptcha = document.getElementById('buttom-captcha');
    botonCaptcha.disabled = true;
    
    const inputCaptcha = formCaptcha.querySelector('#captcha-answer');
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
            captcha.classList.toggle('hiden');
            register.classList.toggle('hiden');
            }
    }, 1000); // 
    
    return;

});

// Controlamos el boton registro
botonRegistro = document.getElementById('button-register');
botonRegistro.addEventListener('click', function(e){
    e.preventDefault();
    generarPreguntaSeguridad();
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
                generarPreguntaSeguridad();
            }
        })
    }
);


// controlamos el boton enviar formulario
const submitForm = document.getElementById('form-register');
submitForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    register.classList.toggle('hiden');
    welcome.classList.toggle('hiden');
})


// El usuario navega hacia el index.html
document.getElementById('searchForm').addEventListener('submit', navIndex);
document.getElementById('button-facebook').addEventListener('click', navIndex);
document.getElementById('button-google').addEventListener('click', navIndex);

function navIndex(e){
    e.preventDefault();
    window.location.href = "index.html"
}
