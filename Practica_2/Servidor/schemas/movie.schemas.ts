import  z  from 'zod';

//Validacion para crear
export const CreateMovieSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(50, "El nombre no puede superar los 50 caracteres"),
        actors: z.string().min(1).max(200,"La lista de actores es demasiado larga")
    })
});

//Validacion para buscar por actores
export const SearchByActorSchema = z.object({
    query: z.object({
        actor: z.string()
        .min(1, "El nombre del actor es obligatorio")
        .max(50, "El nombre es demasiado largo")
    })
});

//Validacion para buscar por fechas
export const FilterByDateSchema = z.object({
    query: z.object({
        date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato debe ser YYYY-MM-DD")
    })
});

//validacion para buscar por rango horario
export const FilterByTimeSchema = z.object({
    query: z.object({
        start: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
        end: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm")
    })
});