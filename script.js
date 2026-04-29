// Conexión con el servidor Socket.io
const socket = io();

// Configuración del Asistente de Voz
const asistente = window.speechSynthesis;

function hablar(texto) {
    // Cancela cualquier voz previa para evitar amontonamiento
    if (asistente.speaking) {
        asistente.cancel();
    }
    
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.85; // Velocidad pausada para adultos mayores
    asistente.speak(mensaje);
}

// Lógica de los Botones de Burbuja
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

// Saludo de Bienvenida al abrir la aplicación
window.onload = () => {
    setTimeout(() => {
        hablar("Bienvenido a tu aplicación de apoyo DIF Contigo.");
    }, 500);
};