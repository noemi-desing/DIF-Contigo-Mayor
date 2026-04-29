const socket = io();
const synth = window.speechSynthesis;

function hablar(texto) {
    if (synth.speaking) { synth.cancel(); }
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-MX';
    u.rate = 0.85; // Velocidad pausada para abuelitos
    synth.speak(u);
}

// Botón Emergencia
document.getElementById('btn-sos').onclick = () => {
    hablar("Enviando alerta de emergencia. Tu familia ha sido notificada.");
    socket.emit('sos-activado', { hora: new Date().toLocaleTimeString() });
};

// Botón Acompañamiento
document.getElementById('btn-acompanamiento').onclick = () => {
    hablar("Iniciando acompañamiento diario. ¿En qué puedo ayudarte hoy?");
};

// Botón Asesoría
document.getElementById('btn-asesoria').onclick = () => {
    hablar("Sección de asesoría social. He detectado que puedes renovar tu apoyo de transporte.");
};

// Bienvenida
window.onload = () => hablar("Bienvenido a DIF Contigo.");