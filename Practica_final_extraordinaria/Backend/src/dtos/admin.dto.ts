import { z } from 'zod';

export const UpdateEstrellasSchema = z.object({
    apartamentoId: z.string().uuid('ID de apartamento no valido'),
    estrellas: z.number().min(0, 'El mínimo de estrellas es 0').max(5,'El máximo de estrellas es 5'),
});

export type UpdateEstrellasInput =z.infer<typeof UpdateEstrellasSchema>;