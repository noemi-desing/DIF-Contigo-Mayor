const socket = io();
const asistente = window.speechSynthesis;

function hablar(texto) {
    if (asistente.speaking) {
        asistente.cancel();
    }
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.8; 
    asistente.speak(mensaje);
}

document.getElementById('btn-sos').onclick = () => {
    hablar("Alerta de emergencia activada. Estamos avisando a tu familia ahora mismo.");
    socket.emit('sos-activado', {
        id: "Usuario-Jalisco",
        hora: new Date().toLocaleTimeString()
    });
};

document.getElementById('btn-acompanamiento').onclick = () => {
    hablar("Iniciando modo acompañamiento diario. ¿Deseas escuchar tus recordatorios de hoy?");
};

document.getElementById('btn-asesoria').onclick = () => {
    hablar("Bienvenido a asistencia social. Tienes una cita pendiente para tu tarjeta de transporte.");
};

window.onload = () => {
    setTimeout(() => {
        hablar("Bienvenido a tu aplicación de apoyo DIF Contigo Mayor.");
    }, 500);
};