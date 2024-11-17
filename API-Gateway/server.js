const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const checker = require('./healthChecker.js');

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

// Endpoint para verificar el estado de todos los servicios
app.get('/health', (req, res) => {
    const statuses = checker.getStatuses();
    res.status(200).json(statuses);
});

app.listen(3001, () => {
    console.log('API Gateway corriendo en el puerto 3001');
});
