import { type Request, type Response } from 'express';
import * as TheaterService from '../services/theater.service';

export const getAllTheaters = async (_req: Request, res: Response) => {
    try {
        const theaters = await TheaterService.getAllTheaters();
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener cines" });
    }
};

export const getTheaterSchedule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const schedule = await TheaterService.getTheaterSchedule(Number(id));
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la cartelera" });
    }
};

export const getTheatersByTime = async (req: Request, res: Response) => {
    try {
        const { day, start, end } = req.query;
        const theaters = await TheaterService.findTheatersByDateAndTimeRange(day as string,start as string, end as string);
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por horario" });
    }
};