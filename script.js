const socket = io();
const asistente = window.speechSynthesis;
let servicioActivo = true;

function hablar(texto) {
    if (!servicioActivo) return;
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.8; 
    asistente.speak(mensaje);
}

// Control del Servicio de Memoria
document.getElementById('check-servicio').onchange = (e) => {
    servicioActivo = e.target.checked;
    if (servicioActivo) {
        hablar("Asistente de memoria activo. Te recordaré tus pendientes.");
    } else {
        asistente.cancel();
    }
};

// Navegación de Paneles
const menuPrincipal = document.getElementById('menu-principal');
const panelAcompanar = document.getElementById('panel-acompanar');
const panelAsesoria = document.getElementById('panel-asesoria');

function cerrarPaneles() {
    panelAcompanar.style.display = 'none';
    panelAsesoria.style.display = 'none';
    menuPrincipal.style.display = 'flex';
}

document.getElementById('btn-acompanamiento').onclick = () => {
    hablar("Cuéntame tus planes de hoy. ¿Tienes citas, banco o mandados?");
    menuPrincipal.style.display = 'none';
    panelAcompanar.style.display = 'flex';
};

document.getElementById('btn-asesoria').onclick = () => {
    hablar("¿En qué podemos apoyarte hoy?");
    menuPrincipal.style.display = 'none';
    panelAsesoria.style.display = 'flex';
};

document.getElementById('btn-sos').onclick = () => {
    hablar("Alerta de emergencia activada. Estamos avisando a tu familia ahora mismo.");
    socket.emit('sos-activado', { id: "Usuario-Jalisco", hora: new Date().toLocaleTimeString() });
};

// Lógica de "Hablar" con el Asistente
document.getElementById('btn-hablar-asistente').onclick = () => {
    // Simulación de interacción
    hablar("Perfecto. He guardado tu salida al banco. Te recordaré llevar llaves, celular y documentos.");
    document.getElementById('texto-asistente').innerText = "Cita: BANCO guardada. Checklist: Llaves, Celular, ID.";
};

// Notificaciones Automáticas (Memoria Remota)
setInterval(() => {
    if (servicioActivo) {
        const ahora = new Date();
        // Ejemplo de recordatorio de medicina a las 2 PM
        if (ahora.getHours() === 14 && ahora.getMinutes() === 0) {
            hablar("Es hora de tomar tu medicamento y beber un poco de agua.");
        }
    }
}, 60000);

window.onload = () => {
    setTimeout(() => { 
        if(servicioActivo) hablar("Bienvenido a DIF Contigo Mayor."); 
    }, 500);
};