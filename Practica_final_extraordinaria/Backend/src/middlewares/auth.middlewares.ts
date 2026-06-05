// src/middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from "express";
import passport from "passport";

export const RequireAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno en la autenticación.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'No autorizado: Token inválido, expirado o ausente.' });
        }

        // Inyectamos el usuario autenticado (con id, role, agencia, cliente) en la petición
        req.user = user;
        next();
    })(req, res, next);
};

// Modificamos allowedRole para que acepte un array de strings si no quieres acoplarte al Enum de Prisma
export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user as any;

        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({ error: 'Acceso denegado: No tienes permisos suficientes para realizar esa acción.' });
            return;
        }
        next();
    };
};