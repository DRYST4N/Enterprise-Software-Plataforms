import { Request, Response, NextFunction } from 'express';


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.user) return res.status(401).json({ error: 'No autenticado' });
    next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    if(!user || user.role !== 'ADMIN') {
        return res.status(401).json({ error: 'Necesita ser Administrador' });
    }
    next();
};