

import jwt from "jsonwebtoken";
import { CreateClient }  from "../../../application/CreateClient.js";
import { GetAllClients } from "../../../application/GetAllClients.js";
import { GetClientById } from "../../../application/GetClientById.js";
import { UpdatClientById } from "../../../application/UpdatClientById.js";
import { DeleteClientById } from "../../../application/DeleteClientById.js";
import { MensajeController } from "../../../../Services/Infrestructura/adapters/Controllers/MensajeController.js";
import { MessageRepository } from "../../../../Services/Infrestructura/adapters/Services/MessageRepository.js";
import { VerifyLogin } from "../../../application/VerifyLogin.js";
export class RegistroController {
  constructor(clientRepository) {
    this.createClientUseCase = new CreateClient(clientRepository);
    this.getAllClientsUseCase = new GetAllClients(clientRepository);
    this.verifyLoginUseCase = new VerifyLogin(clientRepository);
    this.getclientByIdUseCase = new GetClientById(clientRepository);
    this.updateClientByIdUseCase = new UpdatClientById(clientRepository);
    this.deleteClientByIdUseCase = new DeleteClientById(clientRepository);
    this.mensajeController = new MensajeController(new MessageRepository());
  }
  // Método para manejar la solicitud HTTP POST /clients
  async createClient(req, res) {
    try {
      const { nombre, apellido, telefono, gmail, codigo, usuario } = req.body;

      // Crear los datos del cliente y ejecutar el caso de uso para crear al cliente
      const clientData = {
        nombre: nombre ?? '',
        apellido: apellido ?? '',
        telefono: telefono ?? '',
        gmail: gmail ?? '',
        codigo: codigo ?? '',
        usuario: usuario ?? ''
      };

      const newClient = await this.createClientUseCase.execute(clientData);

      // Responder con los datos del cliente creado
      res.status(201).json(newClient);

      // Preparar el mensaje para el cliente
      const mensaje = `Hola ${newClient.nombre} ${newClient.apellido}, tu código de verificación es: ${newClient.codigo}`;

      // Intentar enviar el mensaje sin bloquear la respuesta principal
      try {
        await this.mensajeController.sendMessageUseCase.execute(newClient.telefono, mensaje);
      } catch (smsError) {
        console.error('Error al enviar el SMS:', smsError.message);
      }

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  async getAllClients(req, res) {
    try {
      const clients = await this.getAllClientsUseCase.execute();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyLogin(req, res) {
    try {
      const { usuario, codigo } = req.body;
      // Validar que ambos campos estén presentes
      if (!usuario || !codigo) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const verifiedUser = await this.verifyLoginUseCase.execute(usuario, codigo);
      if (!verifiedUser) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Crear el token JWT si el usuario es válido
      const token = jwt.sign(
        { id: verifiedUser.id, usuario: verifiedUser.usuario },
        process.env.JWT_SECRET || 'tu_secreto_super_secreto', // Secreto JWT
        { expiresIn: '1h' } // Expiración del token
      );

      // Responder con el token
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async getClientById(req, res) {
    try {
      const { id } = req.params;
      const client = await this.getclientByIdUseCase.execute(id);
      if (client) {
        res.status(200).json(client);
      } else {
        res.status(404).json({ message: 'Client not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async updateClientById(req, res) {
    try {
      const { id } = req.params;
      const clientData = req.body;
  
      // Verificar si al menos un campo está presente para actualizar
      if (!clientData.nombre && !clientData.apellido && !clientData.telefono && !clientData.gmail && !clientData.codigo && !clientData.usuario) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
  
      // Ejecutar el caso de uso para actualizar el cliente
      const updatedClient = await this.updateClientByIdUseCase.execute(id, clientData);
  
      // Verificar si el cliente fue encontrado y actualizado
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
  
      res.status(200).json({ message: 'Client updated successfully', updatedClient });
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: error.message });
    }
  }
  async deleteClientById(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.deleteClientByIdUseCase.execute(id);
      if (deleted) {
        res.status(200).json({ message: 'Client deleted successfully' });
      } else {
        res.status(404).json({ message: 'Client not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
}

