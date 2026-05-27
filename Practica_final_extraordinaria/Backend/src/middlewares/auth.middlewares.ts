import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@prisma/client';
import passport from 'passport';

export const RequireAuth = (req: Request, res: Response, next: NextFunction) =>{
    passport.authenticate('jwt', {session: false}, (err: any, user: any, info: any) => {
        if(err){
            return res.status(500).json({ error: 'Error interno en la autenticación'});
        }
        if(!user){
            return res.status(401).json({ error: 'No autorizado: Token inválido, expirado o ausente.'});
        };

        req.user = user;
        next();
    })(req, res, next);
};

export const checkRole = (allowedRole: Role[]) => {
    return(req: Request, res: Response, next: NextFunction): void => {
        const user = req.user as any;

        if(!user || !allowedRole.includes(user.role)){
            res.status(403).json({ error: 'Accesso denegado: No tienes permisos suficientes para realizar esa acción.' });
            return; 
        }
        next();
    };
};