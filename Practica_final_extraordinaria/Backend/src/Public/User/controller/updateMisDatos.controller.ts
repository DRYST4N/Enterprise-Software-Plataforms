import type { Request, Response, NextFunction } from "express";

export const UpdateMisDatosController = (dependencies: any) => {

    const { usecases: { AuthUsecases: { updateMisDatos } } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction)  => {
        try{
            const userId = (req as any).user?.id;
            const role = (req as any).user?.role;

            const perfilActualizado = await updateMisDatos.execute({ userId, role, ...req.body});

            return res.status(200).json({
                message: 'Perfil actualizado con éxito.',
                user: perfilActualizado
            });
            
        }catch(error){
            next(error);
        }
    }
}