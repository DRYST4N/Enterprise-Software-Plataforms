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
    return await prisma.agencia.update({
        where: {id: agenciaId},
        data: status,
    });
};

export const updateApartamentoEstrellasService = async (apartamentoId: string, estrellas: number) =>{
    return await prisma.apartamento.update({
        where:{
            id: apartamentoId,
        },
        data: { estrellas },
    });
};