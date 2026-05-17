import { z} from 'zod';

export const CreateFestivalSchema = z.object({
    nombre: z.string().min(3, "El nombre es muy corto").max(255),
    ubicacion: z.string().max(255).optional().nullable(),
    descripcion: z.string().optional().nullable(),
    fecha_inicio: z.coerce.date().optional().nullable(),
    fecha_fin: z.coerce.date().optional().nullable(),
    imagen_path: z.string().max(500).optional().nullable(),
    aforo: z.coerce.number(),
    artistas: z.preprocess(
        (val) => typeof val === 'string' ? JSON.parse(val) : val,
        z.array(z.string()).default([])
    ),
});

export const comprobarFecha = z.object({
    fecha_inicio: z.coerce.date()
});

export const UpdateFestivalSchema = CreateFestivalSchema.partial();