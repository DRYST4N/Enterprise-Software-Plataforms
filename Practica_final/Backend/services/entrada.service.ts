import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { EntradaDTO } from "../dtos/entrada.dto";


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export class EntradaService {
    static async create(data: EntradaDTO){
        return await prisma.entrada.create({
            data: { ...data } });
    };

    static async update(id: number, data: Partial<EntradaDTO>){
        return await prisma.entrada.update({
            where: { id },
            data: { ...data },
        });
    };

    static async delete(id: number){
        return await prisma.entrada.delete({
            where: { id }
        });
    };
}