const asistente = window.speechSynthesis;
const recognition = new (window.webkitSpeechRecognition || window.Recognition)();
recognition.continuous = true;
recognition.lang = 'es-MX';

let perfil = {
    nombre: "Rosa María",
    inapam: true,
    transporte: false,
    firmaVoz: false,
    proximaCita: "mañana a las 10 en el DIF de Guadalajara"
};

// FUNCIÓN DE VOZ CÁLIDA
function hablar(texto, callback) {
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.85; // Calma y claridad
    mensaje.pitch = 1.1; // Tono amable
    mensaje.onend = () => { if (callback) callback(); };
    asistente.speak(mensaje);
}

// LOGICA DE CONVERSACIÓN (VOZ PRIMERO)
recognition.onresult = (event) => {
    const frase = event.results[event.results.length - 1][0].transcript.toLowerCase();
    
    if (frase.includes("apoyos") || frase.includes("trámites")) {
        abrirPanelApoyos();
    } else if (frase.includes("ayuda") || frase.includes("auxilio")) {
        activarSOS();
    } else if (frase.includes("platicar") || frase.includes("hola")) {
        iniciarPlatica();
    } else if (frase.includes("sí") || frase.includes("hazlo")) {
        // La IA entiende confirmación para trámites
        perfil.transporte = true;
        hablar("¡Listo, Rosa María! Ya hice tu registro para el transporte. No tienes que preocuparte por nada más.");
        actualizarUI();
    }
};

function iniciarPlatica() {
    hablar("Hola Rosa María, qué gusto que me hables. Recuerda que tienes tu cita " + perfil.proximaCita + ". ¿Quieres que te platique qué apoyos nuevos hay para ti?");
}

function abrirPanelApoyos() {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('panel-asesoria').style.display = 'flex';
    generarQR();
    actualizarUI();
    
    if (!perfil.transporte) {
        hablar("Mira Rosa María, aquí está tu código para el DIF. También vi que te falta el apoyo de transporte de Jalisco. Si quieres, yo mando tus papeles por aquí mismo para que no salgas de casa. ¿Te gustaría que lo haga?");
    } else {
        hablar("Aquí tienes tus apoyos al día. Todo está en orden, corazón.");
    }
}

function actualizarUI() {
    const listado = document.getElementById('lista-programas-voz');
    listado.innerHTML = `
        <p>${perfil.inapam ? '✅' : '❌'} INAPAM</p>
        <p>${perfil.transporte ? '✅' : '❌'} Apoyo Transporte</p>
    `;
}

function generarQR() {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    new QRCode(qrDiv, { text: "ID:" + perfil.nombre + "-PUB", width: 150, height: 150 });
}

function activarSOS() {
    hablar("Tranquila Rosa María, ya le estoy avisando a tu hijo Carlos y a Elena la vecina para que te echen una vuelta. No estás sola.");
}

function cerrarPaneles() {
    document.querySelectorAll('.sub-panel').forEach(p => p.style.display = 'none');
    document.getElementById('menu-principal').style.display = 'flex';
}

// INICIO AUTOMÁTICO
window.onload = () => {
    recognition.start();
    setTimeout(() => {
        hablar("Hola Rosa María, soy tu nieto digital. Estoy aquí para cuidarte. Si necesitas algo, solo dímelo.");
    }, 1000);
};