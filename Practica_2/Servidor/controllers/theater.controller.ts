import { type Request, type Response } from 'express';
import * as TheaterService from '../services/theater.service';


export const getAllTheaters = async (_req: Request, res: Response) => {
    try {
        const theaters = await TheaterService.getAllTheaters();
        res.json(theaters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener cines" });
    }
};

export const getTheaterSchedule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const schedule = await TheaterService.getTheaterSchedule(Number(id));
        res.json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la cartelera" });
    }
};

export const getTheatersByTime = async (req: Request, res: Response) => {
    try {
        const { day, start, end } = req.query;
        const theaters = await TheaterService.findTheatersByDateAndTimeRange(day as string,start as string, end as string);
        res.json(theaters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al filtrar por horario" });
    }
};

export const createTheater = async (req: Request, res: Response) => {
    try{
        const { name, capacity } = req.body;
        const theater = await TheaterService.createTheater(name, capacity);
        res.status(201).json(theater);
    }catch(error: any){
        console.error(error);
        res.status(500).json({ error: 'Error al crear el cine' });
    }
};

export const updateTheater = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params['id'] as string);
        const { name, capacity} = req.body;
        const theater = await TheaterService.updateTheater(id, name, capacity);
        res.json(theater);
    }catch(error: any){
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el cine '});
    }
} ;

export const deleteTheater = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params['id'] as string);
        await TheaterService.deleteTheater(id);
        res.status(204).send();
    }catch(error: any){
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el cine'});
    }
}