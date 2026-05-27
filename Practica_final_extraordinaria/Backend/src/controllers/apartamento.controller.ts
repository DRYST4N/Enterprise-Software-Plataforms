import type{ Request, Response } from "express";
import { CreateApartamentoSchema } from "../dtos/apartamentos.dto.js";
import { createApartamentoService, getApartamentosByAgenciaService, updateApartamentoService,deleteApartamentoSevice, getInformeVentasAnualService } from "../services/apartamento.service.js";


export const createApartamento = async(req: Request, res: Response) => {
    const validation = CreateApartamentoSchema.safeParse(req.body);

    if(!validation.success){
        const errores = validation.error.issues.map((err) => err.message);
        return res.status(400).json({errors: errores })
    }

    try{
        const user = req.user as any;
        const nuevoApto = await createApartamentoService(validation.data, user.agencia.id);
        return res.status(201).json({ message: 'Apartamento registrado con éxito.', apartamento: nuevoApto});
    }catch(error){
        return res.status(500).json({ error: ' Error al registrar el apartamento. '});
    }
};

export const getMisApartamentos = async (req: Request, res: Response) => {
    try{
        const user = req.user as any;
        const apartamentos = await getApartamentosByAgenciaService(user.agencia.id);
        return res.status(200).json(apartamentos);
    }catch(error){
        return res.status(500).json({ error: ' Error al obtener tus apartamentos. '});
    }
};

export const updateApartamentos = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const validation = CreateApartamentoSchema.safeParse(req.body);

    if(!validation.success){
        const errores = validation.error.issues.map((err) => err.message);
        return res.status(400).json({ errors: errores});
    }

    try{
        const user =req.user as any;
        const aptoActualizado = await updateApartamentoService(id, user.agencia.id, validation.data);
        return res.status(200).json({ message: 'Apartamento actualizado con éxito.', apartamento: aptoActualizado});
    }catch(error){
        const msg = error instanceof Error ? error.message : 'Error al actualizar el apartamento';
        return res.status(400).json({ error: msg});
    }
};


export const deleteApartamento = async(req: Request, res:Response) => {
    const id = req.params.id as string;
    try{
        const user = req.user as any;
        await deleteApartamentoSevice(id, user.agencia.id);
        return res.status(200).json({ message: 'Apartamento dado de baja correctamente en castilla.rooms.'});
    }catch(error){
        const msg = error instanceof Error ? error.message : 'Error al dar de baja el apartamento.';
        return res.status(400).json({ error: msg});
    }
};


export const getInformeVentas = async(req: Request, res: Response) => {
    const anoParam = req.query.ano as string;

    if(!anoParam || isNaN(parseInt(anoParam, 10))){
        return res.status(400).json({ error: 'Es obligatorio proporcionar un año válido en los parametros de consulta.'});
    }

    try{
        const user = req.user as any;
        const ano = parseInt(anoParam, 10);

        const informe = await getInformeVentasAnualService(user.agencia.id, ano);
        return res.status(200).json(informe);
    }catch(error){
        return res.status(500).json({ error: 'Error interno del servidor al procesar el informe de ventas.'})
    }
};