const socket = io();
const synth = window.speechSynthesis;

function hablar(texto) {
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-MX';
    u.rate = 0.85;
    synth.speak(u);
}

// Botón de Emergencia
document.getElementById('btn-sos').onclick = () => {
    hablar("Alerta de emergencia enviada. Estamos notificando a su familia.");
    socket.emit('sos-activado', { hora: new Date().toLocaleTimeString() });
};

// Botón de Acompañamiento
document.getElementById('btn-acompanamiento').onclick = () => {
    hablar("Iniciando modo acompañamiento. ¿Cómo se siente hoy?");
};

// Botón de Asesoría Social
document.getElementById('btn-asesoria').onclick = () => {
    hablar("Sección de asesoría social. ¿Desea consultar algún trámite?");
};

// Bienvenida al cargar la app
window.onload = () => hablar("Bienvenido a DIF Contigo.");