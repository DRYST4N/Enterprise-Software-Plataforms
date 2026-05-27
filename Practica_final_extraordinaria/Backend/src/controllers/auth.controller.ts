import type { Request, Response } from "express";
import { RegistrarClienteSchema, RegistrarAgenciaSchema } from "../dtos/authDto.js";
import { registrarClientesService, registrarAgenciaService, loginUserService } from "../services/auth.service.js";

export const registrarCliente = async (req: Request, res: Response) => {
    const validation = RegistrarClienteSchema.safeParse(req.body);

    if(!validation.success){
        const errores = validation.error.issues.map(err => err.message);
        res.status(400).json({ errors: errores});
        return;
    }

    try{
        const nuevoCliente = await registrarClientesService(validation.data);
        res.status(201).json({
            message: 'Cliente registrado con éxito.',
            clienteId: nuevoCliente.id
        });
    }catch(error) {
        const msg = error instanceof Error ? error.message : 'Error interno del servidor';
        res.status(400).json({ error: msg });
    }
};

export const registrarAgencia = async (req: Request, res: Response) => {
    const validation = RegistrarAgenciaSchema.safeParse(req.body);

    if(!validation.success){
        const errores = validation.error.issues.map(err => err.message);
        res.status(400).json({ errors: errores});
        return;
    }

    try{
        const nuevaAgencia = await registrarAgenciaService(validation.data);
        res.status(201).json({
            message: 'Agencia registrada con éxito. Pendiente de verificación.',
            agenciaId: nuevaAgencia.id
        });
    }catch (error){
        const msg = error instanceof Error ? error.message : 'Error interno del servidor';
        res.status(400).json({ error: msg });
    }
};

export const login = async (req: Request, res: Response) => {
    const {email, password } = req.body;
    
    if(!email || !password){
        res.status(400).json({error: 'El correo electrónico y la constraseña son obligatorios'});
        return;
    }

    try{
        const data = await loginUserService(email, password);
        return res.status(200).json(data);
    }catch(error){
        const msg = error instanceof Error ? error.message: 'Error al iniciar sesión';
        res.status(401).json({error: msg});
    }
}