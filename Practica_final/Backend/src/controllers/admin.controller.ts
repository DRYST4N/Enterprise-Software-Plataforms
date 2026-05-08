import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getEmpresas = async (_req: Request, res: Response) => {
    try{
        const empresas = await prisma.empresa.findMany({
            include: { usuario: { select: {correo: true, estado: true } } }
        });
        res.json(empresas)
    }catch{
        res.status(500).json({ error: 'Error al obtener empresas' });
    }
};

export const verificarEmpresa = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params.id as string);
        const empresa = await prisma.empresa.update({
            where: { id },
            data: { estado: 'Verificado'}
        });
        res.json(empresa);
    }catch{
        res.status(500).json({ error: 'Error al verificar empresa' });
    }
};

export const rechazarEmpresa = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params.id as string);
        const empresa = await prisma.empresa.update({
            where: { id },
            data: { estado: 'Rechazado' }
        });
        await prisma.usuario.update({
            where: { id: empresa.usuario_id },
            data: { estado: 'Inactivo'}
        });
        res.json(empresa);
    }catch{
        res.status(500).json({ error: 'Error al rechazar una empresa '});
    }
};