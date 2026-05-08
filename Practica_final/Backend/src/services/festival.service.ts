import { FestivalDTO } from "../dtos/festival.dto";
import prisma from '../lib/prisma';

export class FestivalService {
    static async getAll() {
        return await prisma.festival.findMany({
            include: {entrada: true}
        });
    }

    static async getById(id: number) {
        return await prisma.festival.findUnique({
            where: { id },
            include: { entrada: true }
        });
    } 

    static async getByDate(date: Date) {
        const searchDate = new Date(date);

        return await prisma.festival.findMany({
            where: { 
                fecha_inicio: searchDate},
        });
    }

    static async create(data: FestivalDTO){
        return await prisma.festival.create({
            data: {
                ...data,
                artistas: data.artistas || [],
            }
        });
    }

    static async update(id: number, data: Partial<FestivalDTO> ){
        return await prisma.festival.update({
            where: { id },
            data
        });
    }

    static async delete(id: number) {
        return await prisma.festival.delete({
            where: { id }
        });
    }

    static async getDisponibles(fechaActual: Date){
        return await prisma.festival.findMany({
            where: {
                cancelado: false,
                OR: [
                    {
                        fecha_inicio:{
                            gte: fechaActual,
                        },
                    },
                    {
                        fecha_inicio: null,
                    }
                ],
            }
        });
    }

    static async getByEmpresa(empresaId: number){
        return await prisma.festival.findMany({
            where: {
                empresa_id: empresaId
            },
            include: { entrada:true},
        });
    }

    static async cancel(id: number){
        return await prisma.festival.update({
            where: { id },
            data:{ cancelado: true}
        });
    }
}





