import type { Request, Response, NextFunction } from "express";

export const GetMisReservasController = (dependencies: any) => {
    const { usecase: { getMisReservas } }= dependencies;

    return {
        getMisReservas: async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                const clienteId = user?.cliente?.id;

                if (!clienteId) {
                    return res.status(400).json({ error: 'No autorizado o no eres un cliente.' });
                }

                const reservas = await getMisReservas.execute(clienteId);
                
                // Mapeamos las reservas para inyectarles el qrValue empaquetado a cada una desde el servidor
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
}