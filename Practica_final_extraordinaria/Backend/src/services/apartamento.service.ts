import prisma from '../config/db.js';
import type { CreateApartamentoInput } from '../dtos/apartamentos.dto.js';

export const createApartamentoService = async (data: CreateApartamentoInput, agenciaId: string) => {
    return await prisma.apartamento.create({
        data: {
            ...data,
            agenciaId,
        },
    });
};

export const getApartamentosByAgenciaService = async (agenciaId: string) => {
    return await prisma.apartamento.findMany({
        where: {
            agenciaId,
            activo: true,
        },
    });
};

export const updateApartamentoService = async(aptoId: string, agenciaId: string, data: CreateApartamentoInput) => {
    const hoy = new Date();

    const reservasPendientes = await prisma.reserva.findFirst({
        where: {
            apartamentoId: aptoId,
            checkIn: { gt: hoy},
        },
    });

    if(reservasPendientes){
        throw new Error('No se puede modificar el apartamento porque tiene reservas pendientes. ');
    }

    return await prisma.apartamento.update({
        where: {id: aptoId, agenciaId},
        data,
    });
};

export const deleteApartamentoSevice = async (aptoId: string, agenciaId:string) => {
    const hoy = new Date();

    const reservasPendientes = await prisma.reserva.findFirst({
        where:{
            apartamentoId: aptoId,
            checkIn: {gt: hoy},
        },
    });

    if(reservasPendientes){
        throw new Error('No se puede dar de baja el apartamento porque tiene reservas pendientes.');
    }

    return await prisma.apartamento.update({
        where: {id: aptoId, agenciaId},
        data: {activo: false},
    });
};
