import type { Request, Response, NextFunction } from "express";
import { CreateApartamentoSchema } from "../apartamentos.dto.js";

export const UpdateApartmentController = (dependencies: any) => {
    const { usecase: { updateApartment } } = dependencies;

    return {
        updateApartment: async (req: Request, res: Response, next: NextFunction) => {
            try{
                const { id } = req.params;
                const agenciaId = (req as any).user?.agencia?.id;

                if(!agenciaId){
                    throw new Error('No autorizado, Inicie sesión como agencia.');
                }
                
                const validation = CreateApartamentoSchema.safeParse(req.body);

                if(!validation.success){
                    console.log(validation.error.issues.map(err => err.message));
                    throw new Error('Los datos no son validos.')
                }

                const apartamentoModificado = await updateApartment.execute({
                    id, 
                    ...validation.data,
                    agenciaId
                });

                return res.status(200).json({
                    message: 'Apartamento actualizado con éxito.',
                    apartamento: apartamentoModificado,
                });
            }catch (error: any){
                next(error);
            }
        }
    }
}