import { z } from 'zod';

const hoy = new Date();
const hace18annos = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());

export const RegistroSchema = z.object({
    correo: z.string().email(),
    pass: z.string().min(6),
    role: z.enum(['Cliente', 'Empresa']),
    //Datos para el cliente
    nombre_completo: z.string().optional(),
    dni: z.string().optional(),
    fecha_nacimiento: z.coerce.date()
    .max(hace18annos, 'Debes ser mayor de edad')
    .optional(),
    //Datos para la empresa
    razon_social: z.string().optional(),
    cif: z.string().optional(),
    nombre_empresa: z.string().optional(),
    domicilio_social: z.string().optional(),
    nombre_contacto: z.string().optional(),
    telefono_contacto: z.string().optional(),
});