const socket = io();
const asistente = window.speechSynthesis;
let datosPUB = {
    "S01_NOM_INT": "", "S01_1APE_INT": "", "S01_CURP_INT": "",
    "S02_MUN_DOM_INT": "JALISCO", "LAT": "", "LON": "", "FIRMA": "NO"
};
let contactos = [];

function hablar(texto) {
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.85;
    asistente.speak(mensaje);
}

// --- PROTOCOLO DE VOZ REMOTA (ACTIVO SIEMPRE) ---
const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
recognition.continuous = true;
recognition.lang = 'es-MX';

recognition.onresult = (event) => {
    const frase = event.results[event.results.length - 1][0].transcript.toLowerCase();
    if (frase.includes("auxilio") || frase.includes("ayuda") || frase.includes("dif")) {
        iniciarProtocoloEmergencia();
    }
};
recognition.start();

// --- FUNCIONES DE TRÁMITES (PUB) ---
function escanearDocumentos() {
    hablar("Iniciando escaneo. Pon tu identificación frente a la cámara.");
    setTimeout(() => {
        datosPUB.S01_NOM_INT = "ROSA";
        datosPUB.S01_1APE_INT = "LOPEZ";
        datosPUB.S01_CURP_INT = "LOPR500512MJCLRR03";
        document.getElementById('pub-status').innerText = "Estado: Registrada en PUB";
        generarQR();
        hablar("¡Listo Rosa! Ya estás registrada para tus apoyos.");
    }, 3000);
}

function generarQR() {
    new QRCode(document.getElementById("qrcode"), {
        text: JSON.stringify(datosPUB),
        width: 150, height: 150
    });
}

function exportarExcelDIF() {
    const csv = "S01_NOM_INT,S01_1APE_INT,S01_CURP_INT,MUNICIPIO,LAT,LON\n" + 
                `${datosPUB.S01_NOM_INT},${datosPUB.S01_1APE_INT},${datosPUB.S01_CURP_INT},${datosPUB.S02_MUN_DOM_INT},${datosPUB.LAT},${datosPUB.LON}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'REGISTRO_DIF_JALISCO.csv';
    a.click();
    hablar("Archivo de registro generado para el personal administrativo.");
}

// --- GESTIÓN DE CONTACTOS Y SEGURIDAD ---
function sincronizarContactos() {
    hablar("Buscando a tus personas de confianza. ¿Quieres que tu hijo Carlos sea tu contacto de emergencia?");
    // Simulación de permisos
    contactos.push({ nombre: "Carlos (Hijo)", cel: "3312345678", rol: "Emergencia" });
    const lista = document.getElementById('lista-contactos');
    lista.innerHTML = "<li>Carlos (Hijo) - EMERGENCIA</li>";
}

function iniciarProtocoloEmergencia() {
    hablar("He detectado tu voz. Voy a pedirle a tu contacto de confianza que te llame.");
    
    // MENSAJE MODESTO (No alarmista)
    const sms = "Hola, soy el asistente DIF de Rosa. Rosa ha activado su aviso de voz. ¿Podrías llamarle para saludarla y confirmar que todo está bien?";
    console.log("Enviando SMS Modesto:", sms);

    // ESCALACIÓN
    setTimeout(() => {
        hablar("Rosa, tu contacto no ha respondido. ¿Estás bien? Si no respondes, llamaré al 911.");
        setTimeout(() => {
            hablar("Llamando al 911. Enviando tu ficha médica y ubicación oficial.");
            socket.emit('911-alert', datosPUB);
        }, 10000);
    }, 60000);
}

// --- IA ACOMPAÑANTE ---
async function checkClima() {
    const clima = "Hoy en Jalisco hace calor, 28 grados.";
    document.getElementById('clima-widget').innerText = clima;
    hablar(clima + " Si vas a salir al DIF, recuerda llevar agua y tu sombrero.");
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
    setTimeout(() => hablar("DIF Contigo Mayor encendido. Estoy escuchando por si necesitas ayuda."), 1000);
};