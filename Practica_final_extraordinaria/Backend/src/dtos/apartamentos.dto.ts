import { z } from 'zod';

const PROVINCIAS_CYL = [
    'Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'
];

export const CreateApartamentoSchema = z.object({
    nombre: z.string().min(1, 'El nombre del apartamento es obligatorio.'),
    descripcion: z.string().min(1, 'La descripción es obligatoria.'),
    municipio: z.string().min(1, 'El municipio es obligatorio.'),
    provincia: z.string().refine((val) => PROVINCIAS_CYL.includes(val), {
        message: 'La provincia debe pertenecer a Castilla y León.',
    }),
    precioNoche: z.number().positive('El precio por noche debe ser un valor superior a cero.'),
});

export type CreateApartamentoInput = z.infer<typeof CreateApartamentoSchema>;