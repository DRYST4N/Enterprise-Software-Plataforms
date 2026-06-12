import type { Request, Response, NextFunction } from "express";
import { CreateApartamentoSchema } from "../apartamentos.dto.js";
import { BadRequestError } from "../../../middlewares/Errors/CustomErrors.js";

export const CreateApartmentController = (dependencies: any) => {
    const { usecases: { ApartmentUseCases: { createApartment } } } = dependencies;

    return async( req: Request, res: Response, next: NextFunction) => {
            try {
                const agenciaId = (req as any).user?.agencia.id;
                

                const validation = CreateApartamentoSchema.safeParse(req.body);

                if(!validation.success){
                    throw new BadRequestError('Los datos no son correctos.')
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
