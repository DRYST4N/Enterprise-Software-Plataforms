import type { Request, Response, NextFunction } from "express";

export const BloquedAgenciesController = (dependencies: any) => {
    const { usecases: { AdminAgenciesUseCases: { bloquedAgencies } } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { agenciaId } = req.params;
            const { bloqueada } = req.body;

            const resuelto = await bloquedAgencies.execute(agenciaId, bloqueada);

            return res.status(200).json(resuelto);
        } catch(error) {
            next(error);
        }
    }
}