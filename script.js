const socket = io();
const asistente = window.speechSynthesis;
let asistenteActivo = true; // El servicio inicia activo por defecto (remoto)

function hablar(texto) {
    if (!asistenteActivo) return;
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.8; 
    asistente.speak(mensaje);
}

// Lógica de Comandos (Alexa Style)
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

// Navegación de Paneles
const menuPrincipal = document.getElementById('menu-principal');
const panelAcompanar = document.getElementById('panel-acompanar');
const panelAsesoria = document.getElementById('panel-asesoria');

function cerrarPaneles() {
    panelAcompanar.style.display = 'none';
    panelAsesoria.style.display = 'none';
    menuPrincipal.style.display = 'flex';
}

// Botón ACOMPAÑAR (Inteligencia de Memoria)
document.getElementById('btn-acompanamiento').onclick = () => {
    hablar("Hola, cuéntame tus planes. ¿Tienes citas, salidas o medicamentos pendientes?");
    menuPrincipal.style.display = 'none';
    panelAcompanar.style.display = 'flex';
};

// Botón ASESORÍA (Documentos y Escaneo)
document.getElementById('btn-asesoria').onclick = () => {
    hablar("Entrando a documentos oficiales. Puedes escanear tu identificación o subir un archivo.");
    menuPrincipal.style.display = 'none';
    panelAsesoria.style.display = 'flex';
};

function activarEscaneo() {
    hablar("Iniciando escáner. Pon tu credencial frente a la cámara y yo te aviso cuando esté lista.");
    // Aquí iría el acceso a la cámara
}

function subirArchivo() {
    hablar("Buscando documentos en tu celular.");
}

// Botón EMERGENCIA
document.getElementById('btn-sos').onclick = () => {
    hablar("¡Ayuda activada! No te muevas, estamos avisando a tus contactos de emergencia ahora.");
    socket.emit('sos-activado', { id: "Usuario-Jalisco", hora: new Date().toLocaleTimeString() });
};

// Recordatorios Automáticos Proactivos
setInterval(() => {
    if (asistenteActivo) {
        const ahora = new Date();
        // Ejemplo: Recordar agua o llaves
        if (ahora.getMinutes() === 0) { // Cada hora en punto
            hablar("Es un buen momento para beber un poco de agua.");
        }
    }
}, 60000);

window.onload = () => {
    setTimeout(() => { 
        if(asistenteActivo) hablar("Bienvenido a tu asistente personal DIF Contigo Mayor."); 
    }, 800);
};