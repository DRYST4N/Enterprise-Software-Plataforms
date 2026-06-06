import type { Request, Response, NextFunction } from "express";
import { CreateReservaSchema } from "../reservas.dto.js";

export const CreateReservaController = (dependencies: any) => {
    const { usecase: { createReserva } } = dependencies;

    return{
        postResereva: async (req: Request, res: Response, next: NextFunction) => {
            const validation = CreateReservaSchema.safeParse(req.body);

            if(!validation.success) {
                const errores = validation.error.issues.map(err => err.message);
                return res.status(400).json({ errors: errores});
            }

            try{
                const user = (req as any).user;
                const clienteId = user?.cliente?.id;

                if(!clienteId){
                    return res.status(400).json({ error: 'Acceso denegado: Se necesita un perfil de Cliente para poder reservar.'});
                }

                const nuevaReserva = await createReserva.execute(validation.data, clienteId);

                return res.status(201).json({
                    message: 'Reserva confirmada y pago aprobado con éxito.',
                    reserva: nuevaReserva,
                    qrValue: JSON.stringify({
                        reservaId: nuevaReserva.id,
                        titular: nuevaReserva.cardHolder,
                        transactionId: nuevaReserva.transactionId,
                        alojamiento: nuevaReserva.apartamento.nombre
                    })
                });

            }catch(error){
                next(error);
            }
        }
    }
}