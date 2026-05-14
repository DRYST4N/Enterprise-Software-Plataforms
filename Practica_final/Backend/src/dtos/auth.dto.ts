export interface RegistroDTO {
  correo: string;
  pass: string;
  role: 'Cliente' | 'Empresa';
  // Campos opcionales según el perfil
  nombre_completo?: string;
  dni?: string;
  fecha_nacimiento?: Date,
  telefono?: string;
  //Campos opcionales para la empresa
  razon_social?: string;
  cif?: string;
  domicilio_social?: string;
  nombre_contacto?: string;
  telefono_contacto?: string;
}