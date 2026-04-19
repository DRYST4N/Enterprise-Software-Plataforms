import { Request, Response, NextFunction } from 'express';
import * as TheaterService from '../services/theater.service';


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.user) return res.status(401).json({ error: 'No autenticado' });
    next();
};

export const requireAdminOrCinemaOwner = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if(!user) return res.status(401).json({ error: "No autenticado"});
    if (user.role === 'ADMIN') return next();

    if (user.role === 'CINEMA'){
        const theaterId = parseInt(req.params['id'] as string);
        const theater = await TheaterService.findTheaterUnique(theaterId);
        if(theater?.ownerId === user.id) return next();
        return res.status(403).json({ error: 'No tiene permisos para este cine.' });
    }

    return res.status(403).json({ error: 'Acceso denegado'});
};