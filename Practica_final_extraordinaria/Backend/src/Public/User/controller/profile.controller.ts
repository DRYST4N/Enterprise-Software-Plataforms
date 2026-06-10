import type { Request, Response, NextFunction } from "express";

export const ProfileController = (dependencies: any) => {
    const { usecase: { getMisDatos, updateMisDatos } } = dependencies;

    return {
        getMisDatos: async (req: Request, res: Response, next: NextFunction) => {
            try{
                const userId = (req as any).user?.id;

                if(!userId) {
                    return res.status(401).json({ error: 'No autorizado. Sesión inválida.'});
                }

                const perfil = await getMisDatos.execute(userId);
                return res.status(200).json(perfil);
            }catch(error){
                next(error);
            }
        },

        updateMisDatos: async (req: Request, res: Response, next: NextFunction)  => {
            try{
                const userId = (req as any).user?.id;
                const role = (req as any).user?.id;

                if(!userId || !role ){
                    return res.status(401).json({ error: 'No autorizado. Sesión invalida.'});
                }

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
}