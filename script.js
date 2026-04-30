const asistente = window.speechSynthesis;
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let usuarioRegistrado = "Rosa María"; // Esto simula el registro en la nube

function hablar(texto) {
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    asistente.speak(mensaje);
}

// 1. AUTENTICACIÓN POR VOZ (Simulada para prototipo)
function autenticarVoz() {
    if (!Recognition) {
        hablar("Tu navegador no soporta voz. Entrando en modo manual.");
        entrarApp();
        return;
    }

    const rec = new Recognition();
    rec.lang = 'es-MX';
    document.getElementById('status-login').innerText = "Escuchando...";

    rec.onresult = (e) => {
        const vozCapturada = e.results[0][0].transcript.toLowerCase();
        // Si el nombre coincide, "desbloquea" la app en cualquier dispositivo
        if (vozCapturada.includes(usuarioRegistrado.toLowerCase())) {
            hablar(`Bienvenida de nuevo, ${usuarioRegistrado}. Acceso concedido.`);
            entrarApp();
        } else {
            hablar("No reconozco esa voz. Por favor, intenta de nuevo.");
            document.getElementById('status-login').innerText = "Voz no reconocida.";
        }
    };
    rec.start();
}

function entrarApp() {
    document.getElementById('pantalla-login').style.display = 'none';
    document.getElementById('app-principal').style.display = 'block';
}

// 2. FUNCIONALIDAD DE DOCUMENTOS Y QR
function abrirExpediente() {
    document.getElementById('app-principal').style.display = 'none';
    document.getElementById('panel-expediente').style.display = 'flex';
    generarQR();
    hablar("Aquí puedes ver tus documentos oficiales y tu código de atención única.");
}

function generarQR() {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    new QRCode(qrDiv, { 
        text: `PUB-JALISCO-ID:8822-NAME:${usuarioRegistrado}-DOCS:VALIDATED`, 
        width: 150, height: 150 
    });
}

function accionVoz(tipo) {
    document.getElementById('app-principal').style.display = 'none';
    document.getElementById('panel-interaccion').style.display = 'flex';
    const texto = document.getElementById('texto-estado');

    if (tipo === 'acompanar') {
        texto.innerText = "TE ESCUCHO";
        hablar("Hola Rosa, estoy aquí contigo. Cuéntame, ¿cómo te sientes hoy?");
    } else if (tipo === 'ayuda') {
        texto.innerText = "AVISANDO...";
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        hablar("Tranquila, ya le avisé a tu familia y al DIF Jalisco que necesitas ayuda.");
    }
}

function cerrarPaneles() {
    document.querySelectorAll('.sub-panel').forEach(p => p.style.display = 'none');
    document.getElementById('app-principal').style.display = 'block';
}