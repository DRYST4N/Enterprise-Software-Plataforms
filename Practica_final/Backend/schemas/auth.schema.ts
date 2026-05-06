import { z } from 'zod';

export const RegistroSchema = z.object({
    correo: z.string().email(),
    pass: z.string().min(6),
    role: z.enum(['Cliente', 'Empresa']),
    //Datos para el cliente
    nombre_completo: z.string().optional(),
    dni: z.string().optional(),
    //Datos para la empresa
    razon_social: z.string().optional(),
    cif: z.string().optional(),
    nombre_empresa: z.string().optional(),
});