import type { Request, Response, NextFunction } from "express";

export const GetMisReservasController = (dependencies: any) => {
    const { usecases: { BookingUseCases: { getMisReservas } } }= dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const clienteId = user?.cliente?.id;

            const reservas = await getMisReservas.execute(clienteId);
            
            
            const result = reservas.map((r: any) => ({
                ...r,
                qrValue: JSON.stringify({
                    reservaId: r.id,
                    titular: r.cardHolder,
                    transactionId: r.transactionId,
                    alojamiento: r.apartamento.nombre
                })
            }));

            return res.status(200).json(result);
        } catch (error) { next(error); }
    }
}
