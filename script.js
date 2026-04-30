const asistente = window.speechSynthesis;

// DATOS DE USUARIO (Simulación de PUB)
let perfil = {
    nombre: "Rosa María",
    inapam: true,
    transporte: false,
    firmaVoz: false,
    citas: []
};

function hablar(texto) {
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.9;
    asistente.speak(mensaje);
}

// NAVEGACIÓN
function abrirPanel(id) {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById(id).style.display = 'flex';
}

function cerrarPaneles() {
    document.querySelectorAll('.sub-panel').forEach(p => p.style.display = 'none');
    document.getElementById('menu-principal').style.display = 'flex';
}

// LÓGICA DE TRÁMITES
function actualizarProgramas() {
    const list = document.getElementById('check-list-programas');
    list.innerHTML = `
        <p>${perfil.inapam ? '✅' : '❌'} INAPAM</p>
        <p>${perfil.transporte ? '✅' : '❌'} Apoyo Transporte</p>
    `;
    if(!perfil.transporte) {
        hablar("Rosa, veo que no tienes apoyo de transporte. ¿Quieres que inicie el trámite virtual por ti?");
    }
    generarQR();
}

function firmarPorVoz() {
    hablar("Por favor, di tu nombre y la frase: Acepto mi registro social.");
    setTimeout(() => {
        perfil.firmaVoz = true;
        hablar("Firma registrada. Tu QR ahora es oficial.");
        generarQR();
    }, 4000);
}

function generarQR() {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    const data = JSON.stringify({id: "PUB-JAL-001", firma: perfil.firmaVoz});
    new QRCode(qrDiv, { text: data, width: 120, height: 120 });
}

// CITAS
function agendarCitaVoz() {
    hablar("¿Qué cita quieres que recuerde?");
    // Simulación de captura
    setTimeout(() => {
        const nuevaCita = "Mañana a las 10 AM en el DIF.";
        document.getElementById('citas-info').innerHTML = `<strong>Cita:</strong> ${nuevaCita}`;
        hablar("Anotado. Te avisaré 24 horas antes y una hora antes del evento.");
    }, 3000);
}

// SEGURIDAD
function sosManual() {
    hablar("Avisando a Carlos y Elena que necesitas que te llamen.");
}

// BOTONES PRINCIPALES
document.getElementById('btn-acompanamiento').onclick = () => {
    abrirPanel('panel-acompanar');
    document.getElementById('clima-info').innerText = "CLIMA JALISCO: 27°C - Soleado";
};

document.getElementById('btn-asesoria').onclick = () => {
    abrirPanel('panel-asesoria');
    actualizarProgramas();
};

document.getElementById('btn-sos').onclick = () => {
    abrirPanel('panel-sos');
    sosManual();
};

// ESCUCHA "AYUDA"
const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
recognition.continuous = true;
recognition.lang = 'es-MX';
recognition.onresult = (event) => {
    const frase = event.results[event.results.length - 1][0].transcript.toLowerCase();
    if (frase.includes("ayuda") || frase.includes("socorro")) sosManual();
};
recognition.start();

window.onload = () => {
    setTimeout(() => hablar("Hola Rosa María. Estoy lista para ayudarte."), 1000);
};