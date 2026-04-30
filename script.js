const asistente = window.speechSynthesis;
let usuario = { nombre: "Rosa María" };

function hablar(texto) {
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.85; 
    asistente.speak(mensaje);
}

// SALUDO INICIAL Y MEMORIA
window.onload = () => {
    const hora = new Date().getHours();
    let saludo = "Hola";
    if (hora < 12) saludo = "Buenos días";
    else if (hora < 19) saludo = "Buenas tardes";
    else saludo = "Buenas noches";

    setTimeout(() => {
        hablar(`${saludo}, ${usuario.nombre}. Qué gusto saludarte. Soy tu nieto digital. ¿Cómo te sientes hoy? Estoy aquí para escucharte.`);
    }, 1200);

    // Registro de Service Worker para modo offline
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
};

// Detección de internet proactiva
window.addEventListener('offline', () => {
    hablar("Rosa María, se fue el internet por un momento, pero no te preocupes, sigo aquí contigo.");
});

function accionVoz(tipo) {
    const panel = document.getElementById('panel-interaccion');
    const texto = document.getElementById('texto-estado');
    const qrArea = document.getElementById('qrcode-area');
    const card = document.querySelector('.card-simple');
    
    document.getElementById('menu-principal').style.display = 'none';
    panel.style.display = 'flex';
    card.classList.add('activo');

    // Confirmación por vibración
    if (navigator.vibrate) navigator.vibrate(60);

    if (tipo === 'acompanar') {
        texto.innerText = "TE ESCUCHO";
        qrArea.style.display = 'none';
        hablar("Te escucho con atención, Rosa María. Platícame lo que quieras, me gusta mucho conocerte mejor.");
    } 
    else if (tipo === 'apoyos') {
        texto.innerText = "TU CÓDIGO";
        qrArea.style.display = 'flex';
        generarQR();
        hablar("Aquí tienes tu código. Con este cuadrito te podrán atender más rápido en el DIF.");
    } 
    else if (tipo === 'ayuda') {
        texto.innerText = "AVISANDO...";
        qrArea.style.display = 'none';
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        hablar("No te asustes, Rosa María. Ya le pedí a tu familia y al equipo de emergencia de Jalisco que te marquen de inmediato. Todo estará bien.");
    }
}

function generarQR() {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    new QRCode(qrDiv, { 
        text: `DIF-JAL-ID-RM01-USER:${usuario.nombre}-EMERGENCY:3312345678`, 
        width: 170, 
        height: 170 
    });
}

function cerrarPaneles() {
    document.querySelector('.card-simple').classList.remove('activo');
    document.getElementById('panel-interaccion').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'flex';
}