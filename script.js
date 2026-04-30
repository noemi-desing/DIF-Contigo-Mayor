const asistente = window.speechSynthesis;
let perfil = { nombre: "Rosa María" };

function hablar(texto) {
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.85; 
    asistente.speak(mensaje);
}

// SALUDO INICIAL AL ABRIR LA APP
window.onload = () => {
    setTimeout(() => {
        hablar(`Hola ${perfil.nombre}, qué alegría saludarte. Soy tu nieto digital. ¿Cómo te sientes hoy? Estoy aquí para escucharte y ayudarte.`);
    }, 1000);
    
    // Registro de Service Worker para Play Store
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
};

function accionVoz(tipo) {
    const panel = document.getElementById('panel-interaccion');
    const texto = document.getElementById('texto-estado');
    const qrArea = document.getElementById('qrcode-area');
    const card = document.querySelector('.card-simple');
    
    document.getElementById('menu-principal').style.display = 'none';
    panel.style.display = 'flex';
    card.classList.add('hablando');

    if (navigator.vibrate) navigator.vibrate(60);

    if (tipo === 'acompanar') {
        texto.innerText = "TE ESCUCHO";
        qrArea.style.display = 'none';
        hablar("Te escucho con cariño, Rosa María. Platícame lo que quieras, estoy aquí solo para ti.");
    } 
    else if (tipo === 'apoyos') {
        texto.innerText = "TU CÓDIGO";
        qrArea.style.display = 'flex';
        generarQR();
        hablar("Aquí tienes tu código. Con este cuadrito en el DIF podrán atenderte muy rápido.");
    } 
    else if (tipo === 'ayuda') {
        texto.innerText = "AVISANDO...";
        qrArea.style.display = 'none';
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        hablar("Tranquila Rosa María, ya le avisé a tu familia y al equipo de emergencia. La ayuda ya viene en camino.");
    }
}

function generarQR() {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    new QRCode(qrDiv, { text: `DIF-JAL-USER:${perfil.nombre}-EMERGENCIA:3312345678`, width: 160, height: 160 });
}

function cerrarPaneles() {
    document.querySelector('.card-simple').classList.remove('hablando');
    document.getElementById('panel-interaccion').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'flex';
}