import express from 'express';
import rateLimit from 'express-rate-limit';

import { RegistroRepository } from '../../../adapters/Repositories/RegistroRepository.js';
import { RegistroController } from '../../../adapters/Controllers/RegistroController.js';
//aqui implementamos la actividad verificamos el jwt implementado en el codigo
import { VerifyToken } from '../middlewares/verifyToken.js';
//la segundad Actividad de Historiald de peticiones 
import { auditLogger } from '../middlewares/auditLogger.js';

export const clientRouter = express.Router();

const clientRepository = new RegistroRepository();
const clientController = new RegistroController(clientRepository);
// la tercera actividad de Se crea Las Limetaciones de peticiones  
const clientRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //se ingresa el tiempo por cada peticion
  max: 10000, // declaramos la longitud de peticiones 
  message: "Límite de solicitudes excedido. Intente de nuevo más tarde.",
  handler: (req, res, next) => {
    console.warn(`Límite de peticiones excedido para la IP: ${req.ip}`);
    res.status(429).json({ error: "Límite de solicitudes excedido. Intente de nuevo más tarde." });
  }
});

// Aplicar el rate limiter y auditLogger a las rutas específicas de clientRouter
clientRouter.post('/register', auditLogger('Registro de Cliente'), (req, res) => clientController.createClient(req, res));
clientRouter.get('/clientes',  VerifyToken, auditLogger('Consulta de Clientes'), (req, res) => clientController.getAllClients(req, res));
clientRouter.post('/loginNew',  auditLogger('Inicio de Sesión'), (req, res) => clientController.verifyLogin(req, res));
clientRouter.get('/cliente/:id', clientRateLimiter, VerifyToken, auditLogger('Consulta de Cliente por ID'), (req, res) => clientController.getClientById(req, res));
clientRouter.put('/cliente/:id', clientRateLimiter, VerifyToken, auditLogger('Actualización de Cliente'), (req, res) => clientController.updateClientById(req, res));
clientRouter.delete('/cliente/:id', clientRateLimiter, VerifyToken, auditLogger('Eliminación de Cliente'), (req, res) => clientController.deleteClientById(req, res));
// las peticiones se guardan en un archivo .log, donde muestra el historial de peticiones 