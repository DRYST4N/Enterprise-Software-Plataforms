import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { type MovieDTO } from "../dtos/movie.dto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });


// Peliculas disponibles
export const getAllMovies = async () => {
    const movies = await prisma.movie.findMany();

    return movies.map(m => ({
        id: m.id,
        titulo: m.name,
        reparto: m.actors.split(',').map(a => a.trim())
    }));
};

// Peliculas por actor
export const findMoviesByActor = async (actorName: string): Promise<MovieDTO[]> => {
    const movies = await prisma.movie.findMany({
        where: {
            actors: {
                contains: actorName,
                mode: 'insensitive'
            }
        }
    });

    return movies.map(m => ({
        id: m.id,
        titulo: m.name,
        reparto: m.actors.split(',')
    }));
};

// Peliculas disponibles por fechas
export const findMoviesByDate = async (date: string): Promise<MovieDTO[]> => {
    const movies = await prisma.movie.findMany({
        where: {
            show_timing: {
                some: { day: new Date(date) }
            }
        }
    });
    return movies.map(m => ({
        id: m.id,
        titulo: m.name,
        reparto: m.actors.split(',')
    }));
};

// Cines que contienen una pelicula concreta
export const findTheaterByMovie = async (movieId: number) => {
    return await prisma.theater.findMany({
        where: {
            show_timing: {
                some: { movie_id: movieId }
            }
        }
    });
};


//Crear pelicula

export const createMovie = async (name: string, actors: string) =>{
    return await prisma.movie.create({
        data: { name, actors}
    });
};

//Modificar una pelicula
export const updateMovie = async (id: number, name: string, actors: string) => {
    return await prisma.movie.update({
        where: { id },
        data: { name, actors}
    });
};

//Borroa una pelicula
export const deleteMovie = async (id: number) => {
    return await prisma.movie.delete({
        where: { id }
    });
};