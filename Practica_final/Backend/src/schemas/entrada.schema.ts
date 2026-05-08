import { z } from 'zod';

export const CreateEntradaSchema = z.object({
    nombre: z.string().min(3,"El nombre de la entrada es demasiado corto."),
    precio: z.float32().default(0),
    descripcion: z.string().min(10, "Debe especificar las caracteristicas de esta entrada"),
    festival_id: z.int()
});