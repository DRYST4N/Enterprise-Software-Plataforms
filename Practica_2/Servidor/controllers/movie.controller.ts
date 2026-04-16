import { type Request, type Response } from 'express';
import * as MovieService from '../services/movie.service.js';

export const getMoviesByActor = async (req: Request, res: Response) =>{
    try{
        const {actor} = req.query;
        const movies = await MovieService.findMoviesByActor(actor as string);
        res.json(movies);
    } catch(error) {
        res.status(500).json({ error: "Error al obtener peliculas"})
    }
};

export const getAllMovies = async (req:Request, res: Response) =>{
    try{
        const movies = await MovieService.getAllMovies();
        res.json(movies)
    }catch(error){
        res.status(500).json({error: "Error al obtener las peliculas"})
    }
};

export const getMoviesByDate = async (req: Request, res:Response) =>{
    try{
        const {date} = req.query;
        const movies = await MovieService.findMoviesByDate(date as string);

        res.json(movies)
    }catch(error){
        res.status(500).json({error: "Error interno al intentar buscar peliculas por fechas"});
    }
}