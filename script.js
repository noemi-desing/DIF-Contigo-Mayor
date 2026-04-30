const socket = io();
const asistente = window.speechSynthesis;
let asistenteActivo = true; 

function hablar(texto) {
    if (!asistenteActivo) return;
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.8; 
    asistente.speak(mensaje);
}

// Comandos de voz (Alexa Style)
function procesarVoz(comando) {
    const p = comando.toLowerCase();
    if (p.includes("silencio")) { asistenteActivo = false; hablar("Entendido."); }
    if (p.includes("actívate")) { asistenteActivo = true; hablar("Aquí estoy."); }
}

const menu = document.getElementById('menu-principal');
const pAcompanar = document.getElementById('panel-acompanar');
const pAsesoria = document.getElementById('panel-asesoria');

function cerrarPaneles() {
    pAcompanar.style.display = 'none';
    pAsesoria.style.display = 'none';
    menu.style.display = 'flex';
}

document.getElementById('btn-acompanamiento').onclick = () => {
    hablar("Dime tus planes de hoy.");
    menu.style.display = 'none';
    pAcompanar.style.display = 'flex';
};

document.getElementById('btn-asesoria').onclick = () => {
    hablar("Sección de documentos activada.");
    menu.style.display = 'none';
    pAsesoria.style.display = 'flex';
};

document.getElementById('btn-sos').onclick = () => {
    hablar("¡Ayuda activada! Avisando a tu familia.");
    socket.emit('sos-activado', { id: "Usuario-Jalisco", hora: new Date().toLocaleTimeString() });
};

function activarEscaneo() { hablar("Iniciando escáner."); }
function subirArchivo() { hablar("Buscando archivos."); }

// Recordatorio automático (Cada hora)
setInterval(() => {
    if (asistenteActivo && new Date().getMinutes() === 0) {
        hablar("Es momento de beber un poco de agua.");
    }
}, 60000);

window.onload = () => {
    setTimeout(() => { if(asistenteActivo) hablar("Bienvenido a DIF Contigo Mayor."); }, 800);
};