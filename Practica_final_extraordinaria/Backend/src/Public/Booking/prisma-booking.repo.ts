import  { prisma } from '../../Frameworks/prisma.js';
import type { IBookingRepository } from "./booking.repository.js";


export class PrismaBookingRepository implements IBookingRepository{
    async findFuturasPorApartamento(apartamentoId: string, fechaLimite: Date): Promise<any[]> {
        const ahora = new Date();
        return await prisma.reserva.findMany({
            where: {
                apartamentoId,

                checkIn: {
                    lte: fechaLimite
                },
                checkOut: {
                    gte: ahora,
                }

            }
        });
    }

    async findApartamentoActivo(id: string): Promise<any | null> {
        return await prisma.apartamento.findUnique({
            where: { id, activo: true}
        });
    }

    async comprobarConflictoFechas(apartamentoId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
        const conflicto = await prisma.reserva.findFirst({
            where: {
                apartamentoId,
                statusPago: 'approved',
                NOT: [
                    { checkOut: { lte: checkIn } },
                    { checkIn: { gte: checkOut } }
                ]
            }
        });
        return !!conflicto;
    }

    async createReserva(data: any): Promise<any> {
        return await prisma.reserva.create({
            data,
            include: {
                apartamento: {
                    select: { nombre: true, provincia: true, municipio: true},
                }
            }
        });
    }

    async findReservasPorCliente(clienteId: string) {
        return await prisma.reserva.findMany({
            where: { clienteId },
            orderBy: { checkIn: 'desc'},
            include:{
                apartamento: {
                    select: { nombre: true, provincia: true, municipio: true }
                }
            }
        });
    }
}