import type{ Request, Response, NextFunction } from "express";
import { RegistrarClienteSchema } from "../authDto.js";
import { BadRequestError } from "../../../middlewares/Errors/CustomErrors.js";

export const CreateClienteController = (dependencies: any) => {
    const { usecases: { AuthUsecases: { createCliente } } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            console.log("[Controller]: Peticion recibida para registrar Cliente.");

            const validation = RegistrarClienteSchema.safeParse(req.body);
            if(!validation.success) {
                throw new BadRequestError('Error al validar los datos.');
            }

            const nuevoCliente = await createCliente.execute({
                email: validation.data.email,
                passwordPlano: validation.data.password,
                nombreApellidos: validation.data.nombreApellidos,
                dni: validation.data.dni,
                fechaNacimiento: validation.data.fechaNacimiento,
                telefono: validation.data.telefono
            })
            return res.status(201).json({
                message: "Usuario Cliente registrado con éxito.",
                user: nuevoCliente
            });

        }catch(error: any){
            next(error);
        }
    }
}