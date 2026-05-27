import type { Request, Response } from 'express';
import { UpdateEstrellasSchema } from '../dtos/admin.dto.js';
import { getAgenciasService, toggleAgenciaStatusService, updateApartamentoEstrellasService } from '../services/admin.service.js';

export const getAllAgencias = async (req: Request, res: Response) => {
    try{
        const agencias = await getAgenciasService();
        return res.status(200).json(agencias);
    }catch(error){
        return res.status(500).json({ error: 'Error al obtener el listado de agencias.'});
    }
};

export const updateAgenciaStatus = async(req: Request, res: Response) => {
    const id  = req.params.id as string;
    const { verificada, bloqueada } = req.body;

    try{
        const agenciaActualizada = await toggleAgenciaStatusService(id, {verificada, bloqueada});
        return res.status(200).json({
            message: 'Estado de la agencia actualizado con éxito.',
            agencia: agenciaActualizada
        });
    }catch(error){
        return res.status(400).json({ error: 'Error al actualizar el estado de la agencia '});
    }
};

export const updateEstrellas = async (req: Request, res: Response) => {
    const validation = UpdateEstrellasSchema.safeParse(req.body);

    if(!validation.data){
        const errores = validation.error.issues.map((err) => err.message);
        return res.status(400).json({ errors: errores});
    };

    try{
        const aptoActualizado = await updateApartamentoEstrellasService(
            validation.data.apartamentoId,
            validation.data.estrellas
        );
        return res.status(200).json({
            message: 'Estrellas asignadas correctamente por el Administrador',
            apartamento: aptoActualizado
        });
    }catch(error){
        return res.status(400).json({ error: 'Error al actualizar las estrellas del apartamento'});
    }
};

