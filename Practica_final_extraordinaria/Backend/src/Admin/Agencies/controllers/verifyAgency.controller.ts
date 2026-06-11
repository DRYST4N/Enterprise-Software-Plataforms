import type { Request, Response, NextFunction } from "express";

export const VerifyAgencyController = (dependencies: any) => {
    const { usecases: { AdminAgenciesUseCases: { verifyAgency } } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { agenciaId } = req.params;
            const { verificar } = req.body;

            const resultado = await verifyAgency.execute(agenciaId, Boolean(verificar));
            
            return res.status(200).json({
                message: "Estado de verificacion de la agencia actualizado correctamente",
                agenciaId: resultado,
            });
        }catch(error){
            next(error);
        }
    }
}