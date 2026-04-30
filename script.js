const socket = io();
const asistente = window.speechSynthesis;

// ESTRUCTURA OFICIAL PADRÓN ÚNICO (PUB)
let datosPUB = {
    "S01_NOM_INT": "", "S01_CURP_INT": "", "S02_MUN_DOM_INT": "JALISCO",
    "LAT": "", "LON": "", "FIRMA_BIOMETRICA": "NO"
};

function hablar(texto) {
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.85;
    asistente.speak(mensaje);
}

// 1. ESCUCHA REMOTA (Wake Word para caídas o auxilio)
const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
recognition.continuous = true;
recognition.lang = 'es-MX';
recognition.onresult = (event) => {
    const frase = event.results[event.results.length - 1][0].transcript.toLowerCase();
    if (frase.includes("ayuda") || frase.includes("auxilio") || frase.includes("dif")) {
        iniciarProtocoloEmergencia();
    }
};
recognition.start();

// 2. GESTIÓN DE CONTACTOS Y PERMISOS
function sincronizarContactos() {
    hablar("Dime el nombre de tu contacto de confianza.");
    // Simulación de extracción de agenda
    setTimeout(() => {
        const lista = document.getElementById('lista-contactos');
        lista.innerHTML = "<li>Carlos (Hijo) - CONFIANZA</li><li>Elena (Vecina) - MANDADOS</li>";
        hablar("¿Quieres que Carlos sea tu contacto de emergencia y pueda recibir notificaciones?");
    }, 2000);
}

// 3. PROTOCOLO DE EMERGENCIA ESCALADO
function iniciarProtocoloEmergencia() {
    hablar("He detectado tu aviso. Voy a contactar a tu familiar para que te llame.");
    
    // NOTIFICACIÓN MODESTA (Para no asustar)
    const msgSugerencia = "Hola, soy el asistente de DIF. Solo para recomendarte que llames a tu familiar para saludarlo y verificar que todo esté bien.";
    socket.emit('enviar-notificacion', { msg: msgSugerencia });

    // ESCALACIÓN AL 911
    setTimeout(() => {
        hablar("Tu contacto no responde. ¿Estás bien? Si no contestas en 10 segundos, llamaré al 911.");
        setTimeout(() => {
            hablar("Llamando al 9 1 1 y enviando tu ubicación y ficha médica del DIF.");
            socket.emit('alerta-emergencia-real', datosPUB);
        }, 10000);
    }, 60000);
}

// 4. TRÁMITES Y PUB
function escanearDocumentos() {
    hablar("Iniciando escáner. Pon tu INE frente a la cámara.");
    setTimeout(() => {
        datosPUB.S01_NOM_INT = "ROSA MARIA";
        datosPUB.S01_CURP_INT = "ROMA500512MJCLRR03";
        document.getElementById('pub-status').innerText = "REGISTRADA EN EL PUB ✔️";
        const qrContainer = document.getElementById("qrcode");
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, { text: JSON.stringify(datosPUB), width: 130, height: 130 });
        hablar("¡Listo! Ya estás en el sistema oficial del Estado.");
    }, 3000);
}

function firmarVozBiometrica() {
    hablar("Por favor, di fuerte tu nombre completo para registrar tu firma de voz.");
    datosPUB.FIRMA_BIOMETRICA = "SÍ (REGISTRADA)";
}

function exportarExcelDIF() {
    const csv = "NOMBRE,CURP,UBICACION,FIRMA\n" + 
                `${datosPUB.S01_NOM_INT},${datosPUB.S01_CURP_INT},${datosPUB.LAT} ${datosPUB.LON},${datosPUB.FIRMA_BIOMETRICA}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'REPORTE_DIF_JALISCO.csv'; a.click();
}

// 5. IA Y CLIMA
async function checkClima() {
    const info = "Hoy en Jalisco el clima es agradable, 25 grados.";
    document.getElementById('clima-widget').innerText = info;
    hablar(info + " ¿Vas a salir hoy? Recuerda que yo te acompaño.");
}

// NAVEGACIÓN
document.getElementById('btn-acompanamiento').onclick = () => {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('panel-acompanar').style.display = 'flex';
    checkClima();
};
document.getElementById('btn-asesoria').onclick = () => {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('panel-asesoria').style.display = 'flex';
};
document.getElementById('btn-sos').onclick = () => {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('panel-sos').style.display = 'flex';
};

function cerrarPaneles() {
    document.querySelectorAll('.sub-panel').forEach(p => p.style.display = 'none');
    document.getElementById('menu-principal').style.display = 'flex';
}

window.onload = () => {
    navigator.geolocation.getCurrentPosition(p => {
        datosPUB.LAT = p.coords.latitude;
        datosPUB.LON = p.coords.longitude;
    });
    setTimeout(() => hablar("DIF Contigo Mayor encendido. Estoy escuchando por si necesitas ayuda remota."), 1000);
};