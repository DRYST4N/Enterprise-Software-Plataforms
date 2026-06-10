import { prisma } from "../../Frameworks/prisma.js";
import type { IApartamentoRepository } from "./apartments.repository.js";
import type { Apartments } from "./apartment.entity.js";

export class PrismaApartmentRepository implements IApartamentoRepository {
    async findAll(): Promise<Apartments[]> {
        return await prisma.apartamento.findMany({ include: { agencia: true}});
    }
    async findById(id: string): Promise<Apartments | null> {
        console.log('[Prisma Repository] Buscando el apartamento: ')
        return await prisma.apartamento.findUnique({ where: { id }, include: { agencia: true}});
    }
    async findByAgencia(agenciaId: string): Promise<Apartments[]> {
        return await prisma.apartamento.findMany({ where: {agenciaId}});
    }
    async create(data: Omit<Apartments, "id" | "createdAt">): Promise<Apartments> {
        return await prisma.apartamento.create({ data });
    }
    async updateEstrellas(id: string, estrellas: number): Promise<Apartments> {
        return await prisma.apartamento.update({ where: { id }, data: { estrellas }});
    }
    async delete(id: string): Promise<Apartments> {
        return await prisma.apartamento.update({ where: { id }, data:{ activo: false}});
    }
    async update(id: string, data: Omit<Apartments, "id" | "createdAt" | "activo" | "estrellas" | "agenciaId">): Promise<Apartments> {
        console.log('[Prisma Repository]: Actualizando los datos del apartamento.');
        return await prisma.apartamento.update({
            where: { id },
            data:{
                nombre: data.nombre,
                municipio: data.municipio,
                provincia: data.provincia,
                precioNoche: data.precioNoche,
                descripcion: data.descripcion
            }
        });
    }
    async getInforme(agenciaId: string): Promise<any> {
        return await prisma.apartamento.findMany({
            where: { agenciaId },
            select: {
                id: true,
                nombre: true,
                municipio: true,
                reservas: {
                    select: {
                        totalNoches: true,
                        precioTotal: true,
                        checkIn: true
                    }
                }
            }
        })
    }
}