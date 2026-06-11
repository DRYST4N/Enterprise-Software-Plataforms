import type { Request, Response, NextFunction } from "express";

export const GetAllApartmentsController = (dependencies: any) => {

    const { usecases: { AdminApartmentUseCases: { getAllApartments } } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const apartments = await getAllApartments.execute();
            return res.status(200).json(apartments);
        }catch(error){
            next(error);
        }
    }
}