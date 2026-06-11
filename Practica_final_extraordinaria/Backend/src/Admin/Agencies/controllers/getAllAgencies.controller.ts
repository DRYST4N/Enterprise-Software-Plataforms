import type { Request, Response, NextFunction } from "express";


export const GetAllAgenciesController = (dependencies: any) => {
    const { usecases: { AdminAgenciesUseCases: { getAllAgencies } } } = dependencies;
    
    return async(req: Request, res: Response, next: NextFunction) =>{
        try{
            const agencias = await getAllAgencies.execute();
            return res.status(200).json(agencias);
        }catch(error){
            next(error);
        }
    }
}