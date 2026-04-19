import { type Request, type Response } from 'express';
import * as MovieService from '../services/movie.service';
import { parse } from 'node:path';

export const getMoviesByActor = async (req: Request, res: Response) =>{
    try{
        const {actor} = req.query;
        const movies = await MovieService.findMoviesByActor(actor as string);
        res.json(movies);
    } catch(error) {
        console.error(error)
        res.status(500).json({ error: "Error al obtener peliculas"})
    }
};

export const getAllMovies = async (_req:Request, res: Response) =>{
    try{
        const movies = await MovieService.getAllMovies();
        res.json(movies)
    }catch(error){
        console.error('Error completo:', error)
        res.status(500).json({error: "Error al obtener las peliculas"})
    }
};

export const getMoviesByDate = async (req: Request, res:Response) =>{
    try{
        const {date} = req.query;
        const movies = await MovieService.findMoviesByDate(date as string);

        res.json(movies)
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Error interno al intentar buscar peliculas por fechas"});
    }
};

export const createMovie = async (req: Request, res: Response)  => {
    try{
        const {name, actors} = req.body;
        const movie = await MovieService.createMovie(name, actors);

        res.status(201).json(movie);
    }catch(error: any){
        console.error(error);
        res.status(500).json({ error: "Error al crear una pelicula." });
    }
};

export const updateMovie = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params['id'] as string);
        const {name, actors} = req.body;

        const movie = await MovieService.updateMovie(id, name, actors);

        res.status(201).json(movie)
    }catch(error: any){
        console.error(error);
        res.status(500).json({ error: "Error al modificar la pelicula." });
    }
};

export const deleteMovie = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params['id'] as string);
        
        await MovieService.deleteMovie(id);

        res.status(201).send();
    }catch(error: any){
        console.error(error);
        res.status(500).json({ error: "No se ha podido borrar la pelicula."});
    }
};

