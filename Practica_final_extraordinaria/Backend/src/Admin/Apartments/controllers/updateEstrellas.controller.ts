import type { Request,Response,NextFunction } from "express";


export const UpdateEstrellasController = (dependencies: any) => {
    const { usecases: {AdminApartmentsUseCases: { updateEstrellas } } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { apartamentoId } = req.params;
            const { estrellas } = req.body;

            const resultado = await updateEstrellas.execute(apartamentoId, Number(estrellas));
            return res.status(200).json({
                message: "Estrellas asignadas con éxito.",
                apartamento: resultado
            });
        } catch (error: any) { return res.status(400).json({ error: error.message }); }
    }
}