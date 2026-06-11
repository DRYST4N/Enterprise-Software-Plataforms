import type { Request, Response, NextFunction } from 'express';

export const GetOneApartmentController = (dependencies: any) => {
    const { usecases: { ApartmentUseCases: { getOneApartment } } } = dependencies;

    return async(req: Request, res: Response, next: NextFunction) => {
        try{
            const { id } = req.params;

            const apartamento = await getOneApartment.execute(id);

            return res.status(200).json(apartamento);
        }catch(error: any){
            next(error);
        }
    }
}
