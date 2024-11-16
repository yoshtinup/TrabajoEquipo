
import { SendMessageUseCase } from '../../../Aplicativo/SendMessageUseCase.js';
export class MensajeController {
  constructor(servicesRepository) { 
    this.sendMessageUseCase = new SendMessageUseCase(servicesRepository);
  }

  /**
   * Crear una preferencia de pago y manejar la solicitud HTTP.
   * @param {Object} req - La solicitud HTTP.
   * @param {Object} res - La respuesta HTTP.
   */
  
  async sendMessage(req, res) {
    try {
      const { to, body } = req.body;

      // Validar los datos de entrada
      if (!to || typeof to !== 'string') {
        return res.status(400).json({ error: "El campo 'to' es obligatorio y debe ser una cadena de texto." });
      }
      if (!body || typeof body !== 'string') {
        return res.status(400).json({ error: "El campo 'body' es obligatorio y debe ser una cadena de texto." });
      }

      // Ejecutar el caso de uso para enviar el mensaje
      const messageId = await this.sendMessageUseCase.execute(to, body);

      // Enviar la respuesta con el ID del mensaje enviado
      res.status(200).json({ messageId });
    } catch (error) {
      // Manejar errores y enviar una respuesta con el código de error correspondiente
      console.error('Error al enviar el mensaje:', error);
      res.status(500).json({ error: error.message });
    }
  }
}