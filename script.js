const socket = io();
const asistente = window.speechSynthesis;
let asistenteActivo = true; 

// Función Maestra de Voz
function hablar(texto) {
    if (!asistenteActivo) return;
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.8; 
    asistente.speak(mensaje);
}

// Lógica de Comandos de Voz (Alexa Style)
function escucharComandos(comando) {
    const p = comando.toLowerCase();
    if (p.includes("silencio") || p.includes("duérmete")) {
        asistenteActivo = false;
        hablar("Me mantendré en silencio.");
    }
    if (p.includes("actívate") || p.includes("despierta")) {
        asistenteActivo = true;
        hablar("Aquí estoy, siempre contigo.");
    }
}

// Control de Navegación de Paneles
const menuPrincipal = document.getElementById('menu-principal');
const panelAcompanar = document.getElementById('panel-acompanar');
const panelAsesoria = document.getElementById('panel-asesoria');

function cerrarPaneles() {
    panelAcompanar.style.display = 'none';
    panelAsesoria.style.display = 'none';
    menuPrincipal.style.display = 'flex';
}

// EVENTOS DE BOTONES - Conservando toda la funcionalidad
document.getElementById('btn-acompanamiento').onclick = () => {
    hablar("Hola, cuéntame tus planes de hoy. ¿Tienes citas, salidas o medicamentos pendientes?");
    menuPrincipal.style.display = 'none';
    panelAcompanar.style.display = 'flex';
};

document.getElementById('btn-asesoria').onclick = () => {
    hablar("Entrando a documentos oficiales. Puedes escanear tu identificación o subir un archivo.");
    menuPrincipal.style.display = 'none';
    panelAsesoria.style.display = 'flex';
};

// Acciones dentro de los paneles
function activarEscaneo() {
    hablar("Iniciando escáner. Pon tu credencial frente a la cámara y yo te aviso cuando esté lista.");
}

function subirArchivo() {
    hablar("Buscando documentos en tu celular.");
}

// Botón de EMERGENCIA con conexión al servidor
document.getElementById('btn-sos').onclick = () => {
    hablar("¡Ayuda activada! No te preocuepes, ya estamos avisando a tus contactos de emergencia ahora mismo.");
    socket.emit('sos-activado', { id: "Usuario-Jalisco", hora: new Date().toLocaleTimeString() });
};

// Recordatorios Automáticos (Cada hora en punto)
setInterval(() => {
    if (asistenteActivo) {
        const ahora = new Date();
        if (ahora.getMinutes() === 0) { 
            hablar("Hola, es un buen momento para beber un poco de agua y estirar las piernas.");
        }
    }
}, 60000);

// Saludo Inicial
window.onload = () => {
    setTimeout(() => { 
        if(asistenteActivo) hablar("Bienvenido a tu asistente personal DIF Contigo Mayor. Estoy listo para ayudarte."); 
    }, 800);
};