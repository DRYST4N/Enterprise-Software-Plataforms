import type { Request, Response, NextFunction } from 'express';

export const GetOneApartmentController = (dependencies: any) => {
    const { usecase: { getOneApartment } } = dependencies;

    return{
        getOneApartment: async(req: Request, res: Response, next: NextFunction) => {
            try{
                const { id } = req.params;

                if(!id) {
                    throw new Error('El identificador del apartamento es obligatorio. ');
                }

                const apartamento = await getOneApartment.execute(id);

                return res.status(200).json(apartamento);
            }catch(error: any){
                next(error);
            }
        }
    }
}