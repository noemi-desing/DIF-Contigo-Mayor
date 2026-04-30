const asistente = window.speechSynthesis;
let perfil = { nombre: "Rosa María", firmaVoz: true };

function hablar(texto) {
    if (asistente.speaking) asistente.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.rate = 0.85; 
    asistente.speak(mensaje);
}

function accionVoz(tipo) {
    const panel = document.getElementById('panel-confirmacion');
    const texto = document.getElementById('texto-confirmacion');
    const qrArea = document.getElementById('qrcode-area');
    
    document.getElementById('menu-principal').style.display = 'none';
    panel.style.display = 'flex';

    if (tipo === 'acompanar') {
        texto.innerText = "TE ESCUCHO";
        qrArea.style.display = 'none';
        hablar("Hola Rosa María, cuéntame cómo estás. Te escucho con atención.");
    } 
    else if (tipo === 'apoyos') {
        texto.innerText = "TU CÓDIGO";
        qrArea.style.display = 'flex';
        generarQR();
        hablar("Aquí tienes tu código, Rosa María. Todo está en orden con tus apoyos.");
    } 
    else if (tipo === 'ayuda') {
        texto.innerText = "AVISANDO FAMILIA";
        qrArea.style.display = 'none';
        hablar("No te preocupes, Rosa. Ya le avisé a tu hijo Carlos que necesitas ayuda.");
    }
}

function generarQR() {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    new QRCode(qrDiv, { 
        text: JSON.stringify({id: "PUB-RM-01", status: "ACTIVO"}), 
        width: 150, 
        height: 150 
    });
}

function cerrarPaneles() {
    document.getElementById('panel-confirmacion').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'flex';
}

window.onload = () => {
    // Bienvenida proactiva
    setTimeout(() => {
        hablar("Bienvenida Rosa María. Toca cualquier botón para que te ayude.");
    }, 1000);
};