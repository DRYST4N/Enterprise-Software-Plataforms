import type { Request, Response } from "express";
import { createReservaService } from "../services/reserva.service.js";
import { CreateReservaSchema } from "../dtos/reservas.dto.js";


export const postReserva = async (req: Request, res: Response) => {
    const validation = CreateReservaSchema.safeParse(req.body);

    if(!validation.success){
        const errores = validation.error.issues.map((err) => err.message);
        return res.status(400).json({ errors: errores});
    }

    try{
        const user = req.user as any;
        const nuevaReserva = await createReservaService(validation.data, user.client.id);
        return res.status(201).json({
            message: 'Reserva confirmada y pago aprobado con éxito.',
            reserva: nuevaReserva,
            
            qrValue: JSON.stringify({
                reservaId: nuevaReserva.id,
                titular: nuevaReserva.cardHolder,
                transacion: nuevaReserva.transactionId,
                alojamiento: nuevaReserva.apartamento.nombre
            })
        });
    }catch(error) {
        const msg = error instanceof Error ? error.message: ' Error al procesar la reserva.';
        return res.status(400).json({ error: msg});
    }
};

//Se puede hacer mas de una reserva? En caso de que si, habria que generar 1 qr por cada reserva y o habitacion en caso de coger mas de una habitacion.