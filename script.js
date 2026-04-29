const socket = io();
const synth = window.speechSynthesis;

function hablar(texto) {
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-MX';
    u.rate = 0.9;
    synth.speak(u);
}

// Eventos de los botones circulares
document.getElementById('btn-acompanamiento').onclick = () => {
    hablar("Iniciando acompañamiento diario. ¿En qué puedo ayudarte hoy?");
};

document.getElementById('btn-asesoria').onclick = () => {
    hablar("Asistencia social. Te falta subir tu identificación oficial para el apoyo de Mi Pasaje.");
};

document.getElementById('btn-sos').onclick = () => {
    hablar("Enviando alerta de emergencia ahora mismo.");
    socket.emit('sos-activado', { id: "Usuario-01", hora: new Date() });
};

window.onload = () => hablar("Bienvenido a DIF Contigo.");