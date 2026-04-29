const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

// Ruta para la App Espejo del Familiar
app.get('/familiar', (req, res) => {
    res.sendFile(path.join(__dirname, 'familiar.html'));
});

io.on('connection', (socket) => {
    socket.on('sos-activado', (data) => {
        io.emit('alerta-familiar', data); // Avisa al familiar al instante
    });
});

http.listen(3000, () => {
    console.log('PROYECTO COMPLETO CORRIENDO');
    console.log('App Abuelito: http://localhost:3000');
    console.log('App Familiar: http://localhost:3000/familiar');
});