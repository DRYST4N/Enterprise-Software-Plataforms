import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { FestivalDTO } from '../dtos/festival.dto';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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
}



