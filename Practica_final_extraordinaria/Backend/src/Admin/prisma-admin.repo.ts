import { prisma } from "../Frameworks/prisma.js";
import type { IAdminRepository } from "./admin.repository.js";

export class PrismaAdminRepository implements IAdminRepository{
    async updateVerificacionAgencia(agenciaId: string, verificada: boolean) {
        return await prisma.agencia.update({
            where: { id: agenciaId },
            data: { verificada }
        });
    }

    async toggleBloqueoAgencia(agenciaId: string, bloqueada: boolean){
        return await prisma.agencia.update({
            where: { id: agenciaId },
            data: { bloqueada }
        });
    }

    async findAllAgencias(){
        return await prisma.agencia.findMany({
            include:{
                user: {
                    select: { email: true, createdAt: true}
                }
            }
        });
    }

    async findAllApartments(){
        return await prisma.apartamento.findMany({
            include:{
                agencia:{
                    select:{
                        razonSocial: true
                    }
                }
            }
        });
    }

    async updateEstrellasApartments(apartmentId: string, estrellas: number){
        return await prisma.apartamento.update({
            where: { id: apartmentId },
            data: { estrellas }
        });
    }
}