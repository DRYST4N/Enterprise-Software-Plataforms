import type { Request, Response, NextFunction } from 'express';


export const GetAllAparmentsController = (dependencies: any) => {
    const { usecases: { ApartmentUseCases: { getAllApartments } } } = dependencies;

    return  async (req: Request, res: Response, next: NextFunction) => {
        try{
            const apartamentos = await getAllApartments.execute();

            return res.status(200).json(apartamentos);
        }catch(error){
            next(error);
        }
    }
}