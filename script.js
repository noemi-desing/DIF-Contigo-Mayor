const asistente = window.speechSynthesis;
const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
recognition.continuous = true;
recognition.lang = 'es-MX';

let perfil = {
    nombre: "Rosa María",
    transporte: false,
    cita: "mañana a las 10:00 AM en el DIF"
};

function hablar(texto, callback) {
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.85; 
    mensaje.pitch = 1.1; 
    mensaje.onend = () => { if (callback) callback(); };
    asistente.speak(mensaje);
}

recognition.onresult = (event) => {
    const frase = event.results[event.results.length - 1][0].transcript.toLowerCase();
    
    if (frase.includes("apoyos") || frase.includes("trámites") || frase.includes("código")) {
        abrirPanelApoyos();
    } else if (frase.includes("ayuda") || frase.includes("auxilio")) {
        activarSOS();
    } else if (frase.includes("sí") || frase.includes("hazlo")) {
        realizarTramiteVoz();
    }
};

function iniciarPlatica() {
    hablar("Hola Rosa María, qué gusto saludarte. Recuerda que tienes tu cita " + perfil.cita + ". ¿Quieres que revisemos tus apoyos hoy?");
}

function abrirPanelApoyos() {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('panel-asesoria').style.display = 'flex';
    generarQR();
    if (!perfil.transporte) {
        hablar("Aquí está tu código, Rosa María. También vi que te falta el apoyo de transporte. Si quieres, yo lo tramito por ti ahora mismo para que no salgas de casa. ¿Te gustaría?");
    }
}

function realizarTramiteVoz() {
    perfil.transporte = true;
    hablar("¡Listo, corazón! Ya envié tu solicitud de transporte. Yo te aviso cuando esté aprobado.");
    document.getElementById('lista-programas-voz').innerHTML = "<p>✅ INAPAM</p><p>✅ Apoyo Transporte (En proceso)</p>";
}

function generarQR() {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    new QRCode(qrDiv, { text: "PUB-ROSA-MARIA", width: 150, height: 150 });
}

function activarSOS() {
    hablar("Tranquila Rosa, ya le avisé a Carlos que necesitas ayuda. Él te va a marcar pronto.");
}

function cerrarPaneles() {
    document.querySelectorAll('.sub-panel').forEach(p => p.style.display = 'none');
    document.getElementById('menu-principal').style.display = 'flex';
}

window.onload = () => {
    recognition.start();
    setTimeout(() => hablar("Hola Rosa María, soy tu nieto digital. Estoy aquí para cuidarte."), 1000);
};