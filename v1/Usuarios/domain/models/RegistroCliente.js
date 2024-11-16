import { v4 as uuidv4 } from 'uuid';

export class RegistroCliente {
  constructor(id, nombre = '', apellido = '', telefono, gmail, codigo = null, usuario= '') {
    this.id = id ?? null;
    this.nombre = nombre ? this.validateString(nombre) : '';
    this.apellido = apellido ? this.validateString(apellido) : '';
    this.telefono = this.validatePhoneNumber(telefono);
    this.gmail = this.validateEmail(gmail);
    this.codigo = codigo ? this.validateCodigo(codigo) : this.generateCodigo(); 
    this.usuario = usuario;
  }


  validatePhoneNumber(phoneNumber) {
    const normalizedPhoneNumber = String(phoneNumber).trim();
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; 
  
    if (!phoneRegex.test(normalizedPhoneNumber)) {
      throw new Error('Invalid phone number');
    }
  
    return normalizedPhoneNumber;
  }
  


  validateString(value) {
    if (typeof value !== 'string') {
      throw new Error('Invalid string value');
    }
    return value.trim();
  }


  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address');
    }

    return email.trim();
  }


  validateCodigo(codigo) {
    if (typeof codigo !== 'string' || codigo.trim() === '') {
      throw new Error('Invalid code value');
    }
    return codigo.trim();
  }


  generateCodigo() {
    return uuidv4(); 
  }


  getFullName() {
    return `${this.nombre} ${this.apellido}`;
  }
}
