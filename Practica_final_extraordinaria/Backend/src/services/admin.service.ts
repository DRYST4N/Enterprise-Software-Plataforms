import { boolean } from 'zod';
import prisma from '../config/db.js';

export const getAgenciasService = async() => {
    return await prisma.agencia.findMany({
        include:{
            user:{
                select: {
                    email:true,
                    createdAt: true
                },
            },
        },
    });
};

export const toggleAgenciaStatusService = async(
    agenciaId: string,
    status: { verificada?: boolean, bloqueada?: boolean }
) => {
    console.log( `[Prisma Service] Ejecutando update directo en la tabla de la Agencia para ID: ${agenciaId}`);
    console.log(`[Prisma Service] Valores a escribir -> verificada: ${status.verificada}, bloqueada: ${status.bloqueada}`);

    return await prisma.agencia.update({
        where: {id: agenciaId},
        data: {
            verificada: Boolean(status.verificada),
            bloqueada: Boolean(status.bloqueada)
        },
    });
};

export const updateApartamentoEstrellasService = async (apartamentoId: string, estrellas: number) =>{
    console.log(`[Prisma Service] Actualizando estrellas para el apartamento ID: ${apartamentoId} a ${estrellas}`)
    return await prisma.apartamento.update({
        where:{
            id: apartamentoId,
        },
        data: { estrellas },
    });
};

export const getAllApartamentosService = async () => {
    console.log(' [Prisma Service] Extrayendo todos los inmuebles de la base de datos.');

    return await prisma.apartamento.findMany({
        include: {
            agencia: true
        }
    });
};