import prisma from "../lib/prisma";
import { EntradaDTO } from "../dtos/entrada.dto";

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

    static async getById(id: number){
        return await prisma.entrada.findUnique({
            where: { id }
        });
    }
}