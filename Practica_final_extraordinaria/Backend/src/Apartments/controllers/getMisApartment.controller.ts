import type { Request, Response, NextFunction } from 'express';

export const GetMisAPartmentController = (dependencies: any) => {
    const { usecase: { getMisApartments } } = dependencies;

    return {
        getMisApartments: async (req: Request, res: Response, next: NextFunction ) => {
            try{
                const agenciaId = (req as any).user?.agencia?.id;

                if(!agenciaId) throw new Error('Permiso denegado, debe estar autenticado.');

                const apartments = await getMisApartments(agenciaId);
                return res.status(200).json(apartments);
            }catch(error){ next(error) }
        }
    }
}