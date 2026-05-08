import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticate = passport.authenticate('jwt', {session: false});

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as any;
        if (user && roles.includes(user.role)){
            return next();
        }
        return res.status(403).json({ message: "No tienes permisos para esta accion"});
    };
};

export const checkEmpresa = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as any;
        if (user && user.role === 'Empresa'){
            return next();
        }
        return res.status(403).json({ message: "No tienes permisos para esta accion"});
    };
};