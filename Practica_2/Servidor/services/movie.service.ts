import { PrismaClient } from '@prisma/client';
import { type MovieDTO } from "../dtos/movie.dto.js";

const prisma = new PrismaClient();

// Peliculas disponibles
export const getAllMovies = async () => {
    return await prisma.movie.findMany();
}

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
}

// Cines que contienen una pelicula concreta
export const findTheaterByMovie = async (movieId: number) => {
    return await prisma.theater.findMany({
        where: {
            show_timing: {
                some: { movie_id: movieId }
            }
        }
    });
}