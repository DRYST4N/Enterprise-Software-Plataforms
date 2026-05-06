export interface RegistroDTO {
  correo: string;
  pass: string;
  role: 'Cliente' | 'Empresa';
  // Campos opcionales según el perfil
  nombre_completo?: string;
  dni?: string;
  razon_social?: string;
  cif?: string;
  nombre_empresa?: string;
}