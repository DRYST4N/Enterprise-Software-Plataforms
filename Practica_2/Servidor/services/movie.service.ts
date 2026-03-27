import {PrismaClient, type movie} from "@prisma/client";
import  { type  MovieDTO } from "../dtos/movie.dto.js";

const prisma = new PrismaClient();

export const findMoviesByActor = async (actorName: string): Promise<MovieDTO[]> => {
    const movies = await prisma.movie.findMany({
        where:{
            actors:{
                contains: actorName,  //Se busca si el nombre del actor esta en el string
                mode: 'insensitive' //ignoramos mayusculas y minusculas
            }
        }
    });

    return movies.map((m: movie) => ({
        id: m.id,
        titulo: m.name,
        reparto: m.actors.split(',') //Transformamos el string completo en un array.
    }));
};