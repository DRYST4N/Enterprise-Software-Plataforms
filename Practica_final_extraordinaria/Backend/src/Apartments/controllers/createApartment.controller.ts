import type { Request, Response, NextFunction } from "express";
import { CreateApartamentoSchema } from "../apartamentos.dto.js";

export const CreateApartmentController = (dependencies: any) => {
    const { usecase: { createApartment}} = dependencies;

    return {
        createApartment: async( req: Request, res: Response, next: NextFunction) => {
            try {
                const agenciaId = (req as any).user?.agencia.id;

                if (!agenciaId) {
                    throw new Error('El usuario no esta autenticado.');
                }

                const validation = CreateApartamentoSchema.safeParse(req.body);

                if(!validation.success){
                    throw new Error('Los datos no son correctos.')
                }
                const apartamentoCreado = await createApartment.execute({ ...validation.data, agenciaId});
                return res.status(201).json({
                    message: 'Apartamento registrado con éxito.',
                    apartamento: apartamentoCreado
                });
            }catch(error){
                next(error);
            }
        }
    }
}