// Configura dotenv
require('dotenv').config(); // Asegúrate de llamar a la función

const http = require('http');
const app = require('./index'); // Asegúrate de que './index' exporte tu aplicación Express
const cors = require('cors');

// Configura CORS
app.use(cors({
    origin: ['http://localhost:3000'], // Asegúrate de incluir el protocolo
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configura el servidor
const PORT = process.env.PORT || 3000; // Proporciona un valor predeterminado si process.env.PORT no está definido
const IP = 'localhost'; // Puedes usar 'localhost' o la IP de tu servidor

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${IP}:${PORT}/`);
});
