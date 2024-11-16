export class VerifyLogin {
    constructor(loginRepository) {
      this.loginRepository = loginRepository; // Inyección del puerto (repositorio)
    }
  
    /**
     * Ejecutar la verificación del login de un cliente.
     * @param {string} usuario - El nombre de usuario.
     * @param {string} codigo - La contraseña proporcionada.
     * @returns {Promise<Object>} - Información del usuario si las credenciales son correctas.
     */
    async execute(usuario, codigo) {
      const loginData = await this.loginRepository.findLoginByUsername(usuario);
  
      if (!loginData) {
        throw new Error('Invalid username or password');
      }
  
      // Verificar la contraseña (Nota: en un entorno real, se debe comparar el hash)
      if (loginData.codigo !== codigo) {
        throw new Error('Invalid username or password');
      }
  
      return {
        id: loginData.id,
        usuario: loginData.usuario,
        gmail: loginData.gmail,
      };
    }
  }
  