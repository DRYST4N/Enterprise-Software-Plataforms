import type { Request, Response, NextFunction } from 'express';

export const GetMisApartmentController = (dependencies: any) => {
    const { usecases: { ApartmentUseCases: { getMisApartments } } } = dependencies;

    return  async (req: Request, res: Response, next: NextFunction ) => {
        try{
            const agenciaId = (req as any).user?.agencia?.id;

            const apartments = await getMisApartments.execute(agenciaId);

            return res.status(200).json(apartments);
        }catch(error){ next(error) }
    }
}