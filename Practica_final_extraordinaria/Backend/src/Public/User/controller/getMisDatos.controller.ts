import type{ Request, Response, NextFunction } from "express";

export const getMisDatosController = (dependencies: any) => {
    const { usecases: { AuthUsecases: { getMisDatos } } } = dependencies;
    
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const userId = (req as any).user?.id;

            const perfil = await getMisDatos.execute(userId);

            return res.status(200).json(perfil);
        }catch(error){
            next(error);
        }
    }
}
