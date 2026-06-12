import type { Request, Response, NextFunction } from "express";
import { CreateReservaSchema } from "../reservas.dto.js";
import { BadRequestError } from "../../../middlewares/Errors/CustomErrors.js";

export const CreateReservaController = (dependencies: any) => {
    const { usecases: { BookingUseCases: { createReserva } } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        const validation = CreateReservaSchema.safeParse(req.body);

        if(!validation.success) {
            throw new BadRequestError('Error en la validacion de los datos.');            
        }

        try{
            const user = (req as any).user;
            const clienteId = user?.cliente?.id;

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
