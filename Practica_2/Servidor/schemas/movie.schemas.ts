import  z  from 'zod';

export const CreateMovieSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(50, "El nombre no puede superar los 50 caracteres"),
        actors: z.string().min(1).max(200,"La lista de actores es demasiado larga")
    })
})