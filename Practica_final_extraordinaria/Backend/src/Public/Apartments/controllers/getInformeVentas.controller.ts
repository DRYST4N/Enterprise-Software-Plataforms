import type { Request, Response, NextFunction } from "express";

export const GetInformeVentasController = (dependencies: any) => {
    const { usecases: { ApartmentUseCases: { getInformeVentas } } } = dependencies;

    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            const agenciaId = (req as any).user?.agencia?.id;
            const informe = await getInformeVentas.execute(agenciaId);

            return res.status(200).json(informe);
        }catch(error) {
            next(error);
        }
    }
}