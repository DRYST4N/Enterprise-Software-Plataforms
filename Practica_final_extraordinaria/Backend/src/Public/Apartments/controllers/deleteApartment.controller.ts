import type { Request, Response, NextFunction} from 'express';

export const DeleteApartmentController = (dependencies: any) => {
    const { usecases :  { ApartmentUseCases: { deleteApartment } } } = dependencies;
    return  async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { id } = req.params;
            const agenciaId = (req as any).user?.agencia?.id;
            await deleteApartment.execute(id, agenciaId);
            return res.status(200).json({ message: ' Alojamiento dado de baja con éxito.'});
        }catch(error: any){
            next(error);
        }
    }
}