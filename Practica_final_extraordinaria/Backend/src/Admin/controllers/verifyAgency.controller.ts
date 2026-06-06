import type { Request, Response, NextFunction } from "express";


export const AdminActionController = (dependencies: any) => {
    const { usecase: { verifyAgency, getAllAgencies, getAllApartments, updateEstrellas, getServicesStatus } } = dependencies;

    return {
        verifyAgency: async (req: Request, res: Response, next: NextFunction) => {
            try{
                const { agenciaId } = req.params;
                const { verificar } = req.body;

                const resultado = await verifyAgency.execute(agenciaId, Boolean(verificar));
                return res.status(200).json({
                    message: "Estado de verificacion de la agencia actualizado correctamente",
                    agenciaId: resultado,
                });
            }catch(error){
                next(error);
            }
        },

        getAllAgencies: async(req: Request, res: Response, next: NextFunction) =>{
            try{
                const agencias = await getAllAgencies.execute();
                return res.status(200).json(agencias);
            }catch(error){
                next(error);
            }
        },

        getAllApartment: async(req: Request, res:Response, next: NextFunction) => {
            try{
                const apartments = await getAllApartments.execute();
                return res.status(200).json(apartments);
            }catch(error){
                next(error);
            }
        },

        updateEstrellas: async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { apartamentoId } = req.params;
                const { estrellas } = req.body;

                const resultado = await updateEstrellas.execute(apartamentoId, Number(estrellas));
                return res.status(200).json({
                    message: "Estrellas asignadas con éxito.",
                    apartamento: resultado
                });
            } catch (error: any) { return res.status(400).json({ error: error.message }); }
        },

        getSystemStatus: async(req: Request, res: Response, next: NextFunction) => {
            try{
                const statusReport = await getServicesStatus.execute();
                return res.status(200).json(statusReport);
            }catch(error){
                next(error);
            }
        }

    }
}