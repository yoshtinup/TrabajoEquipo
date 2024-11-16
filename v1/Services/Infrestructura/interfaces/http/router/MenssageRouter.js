
import express from 'express';

import { MessageRepository } from '../../../adapters/Services/MessageRepository.js';
import { MensajeController } from '../../../adapters/Controllers/MensajeController.js';
export const MessageRouter = express.Router();

const servicesRepository = new MessageRepository();
const servicesController = new MensajeController(servicesRepository);

// Definir la ruta POST /clients
MessageRouter.post("/send-sms", (req, res) => servicesController.sendMessage(req, res));


