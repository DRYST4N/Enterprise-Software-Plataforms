import type { Request, Response, NextFunction } from "express";

export const GetInformeVentasController = (dependencies: any) => {
    const { usecase: { getInformeVentas } } = dependencies;

    return{ 
        getInformeVentas: async(req: Request, res: Response, next: NextFunction) => {
            try {
                const agenciaId = (req as any).user?.agencia?.id;
                if(!agenciaId) throw new Error('No tiene permisos para realizar esta acción.');
                const informe = await getInformeVentas.execute(agenciaId);

                return res.status(200).json(informe);
            }catch(error) {
                next(error);
            }
        }
    }
}