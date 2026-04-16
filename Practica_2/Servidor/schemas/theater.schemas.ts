import { z } from 'zod';

//Esquema para filtrar cines por horarios
export const FilterTheaterbyTimeSchema = z.object({
    query: z.object({
        start: z.string().regex(/^\d{2}:\d{2}$/, "El formato debe ser HH:mm (ej: 18:00)"),
        end: z.string().regex(/^\d{2}:\d{2}$/, "El formato debe ser HH:mm (ej: 18:00)")
    })
});

//Esquema para obtener la cartelera de un cine en concreto
export const TheaterIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "El ID debe ser un número").transform(Number)
    })
});