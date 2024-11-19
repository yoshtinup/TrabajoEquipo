//server.js
// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const checker = require('./healthChecker.js');

// const app = express();

// const USER_SERVICE_URL = 'http://localhost:3002';
// const NOTIFICATION_SERVICE_URL = 'http://localhost:3003';

// // Middleware para proxy de verificación de salud
// app.get('/usuario/health', createProxyMiddleware({
//     target: USER_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: { '^/usuario/health': '/health' }
// }));

// app.get('/notificacion/health', createProxyMiddleware({
//     target: NOTIFICATION_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: { '^/notificacion/health': '/health' }
// }));


// // Endpoint para verificar el estado de todos los servicios
// app.get('/health', (req, res) => {
//     const statuses = checker.getStatuses();
//     res.status(200).json(statuses);
// });

// app.listen(3001, () => {
//     console.log('API Gateway corriendo en el puerto 3001');
// });


const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const HealthChecker = require('./healthChecker.js'); // Se importa la clase de verificación de salud

const app = express();

const USER_SERVICE_URL = 'http://localhost:3002';
const NOTIFICATION_SERVICE_URL = 'http://localhost:3003';

// Middleware para proxy de verificación de salud
app.get('/usuario/health', createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/usuario/health': '/health' }
}));

app.get('/notificacion/health', createProxyMiddleware({
    target: NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/notificacion/health': '/health' }
}));

// Crear un instancio de HealthChecker
const services = [
    { name: 'User Service', url: 'http://localhost:3002/health' },
    { name: 'Notification Service', url: 'http://localhost:3003/health' }
];

const checker = new HealthChecker(services, 1800000); // 30 minutos de intervalo
checker.start();

// Endpoint para verificar el estado de todos los servicios
app.get('/health', async (req, res) => {
    // Ejecuta el chequeo de salud inmediatamente
    await checker.checkServices();

    const statuses = checker.getStatuses();
    res.status(200).json(statuses);
});

// Levanta el servidor y muestra el estado inicial
app.listen(3001, async () => {
    console.log('API Gateway corriendo en el puerto 3001');
    
    // Realiza una verificación de salud inicial al iniciar el servidor
    await checker.checkServices();
    
    // Imprime el estado de los servicios en la consola
    const initialStatuses = checker.getStatuses();
    console.log('Estado inicial de los servicios:', JSON.stringify(initialStatuses, null, 2));
});
