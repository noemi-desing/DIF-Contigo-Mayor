const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    // Escucha la alerta SOS del abuelito y la retransmite
    socket.on('sos-activado', (data) => {
        io.emit('alerta-familiar', data); 
        console.log("¡Alerta SOS recibida!");
    });
});

http.listen(3000, () => console.log('Servidor en http://localhost:3000'));