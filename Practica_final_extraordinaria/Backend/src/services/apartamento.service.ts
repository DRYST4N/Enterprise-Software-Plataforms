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

export const getInformeVentasAnualService = async(agenciaId: string, ano: number) => {
    const apartamentos = await prisma.apartamento.findMany({
        where: { agenciaId },
        include: {
            reservas: {
                where: {
                    statusPago: 'approved',
                    checkIn:{
                        gte: new Date(`${ano}-01-01T00:00:00.000Z`),
                        lte: new Date(`${ano}-12-31T23:59:59.999Z`),
                    },
                },
                select: {
                    precioTotal: true,
                },
            },
        },
    });
    
    let facturacionTotalAgencia = 0;

    const desgloseApartamentos = apartamentos.map((apto) => {
        const ingresosApto = apto.reservas.reduce((total, reserva) => total + reserva.precioTotal, 0);

        facturacionTotalAgencia += ingresosApto;
        return {
            apartamentoId: apto.id,
            nombre: apto.nombre,
            municipio: apto.municipio,
            provincia: apto.provincia,
            totalReservasEnAno: apto.reservas.length,
            ingresosGenerados: parseFloat(ingresosApto.toFixed(2)),
        };
    });

    return {
        anoFacturacion: ano,
        totalIngresosAgencia: parseFloat(facturacionTotalAgencia.toFixed(2)),
        desglosePorApartamentos: desgloseApartamentos,
    };
};
