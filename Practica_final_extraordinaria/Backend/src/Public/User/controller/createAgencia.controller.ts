import type { Request, Response, NextFunction } from "express";
import { RegistrarAgenciaSchema } from "../authDto.js";
import { BadRequestError } from "../../../middlewares/Errors/CustomErrors.js";

export const CreateAgenciaController = (dependencies: any) => {
    const { usecases: { AuthUsecases: { createAgencia } } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            console.log("[Controller] Peticion para registrar Agencia.");

            const validation = RegistrarAgenciaSchema.safeParse(req.body);

            if(!validation.success) {
                throw new BadRequestError('Error al validar los datos.');
            }

            const nuevaAgencia = await createAgencia.execute({
                email: validation.data.email,
                passwordPlano: validation.data.password,
                razonSocial: validation.data.razonSocial,
                cif: validation.data.cif,
                domicilioSocial: validation.data.domicilioSocial,
                nombreContacto: validation.data.nombreContacto,
                telefono: validation.data.telefono,
            });

            return res.status(201).json({
                message: "Usuario Agencia registrado con éxito. Pendiente de verificación por el Administrador.",
                user: nuevaAgencia,
            });
        }catch(error){
            next(error);
        }
    }
}
