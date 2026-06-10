import type{ Request, Response, NextFunction } from "express";
import { RegistrarClienteSchema } from "../authDto.js";

export const CreateClienteController = (dependencies: any) => {
    const { usecase: { createCliente } } = dependencies;

    return{
        createCliente: async (req: Request, res: Response, next: NextFunction) => {
            try{
                console.log("[Controller]: Peticion recibida para registrar Cliente.");

                const validation = RegistrarClienteSchema.safeParse(req.body);
                if(!validation.success) {
                    return res.status(400).json({
                        errors: validation.error.issues.map(err => err.message)
                    });
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
}