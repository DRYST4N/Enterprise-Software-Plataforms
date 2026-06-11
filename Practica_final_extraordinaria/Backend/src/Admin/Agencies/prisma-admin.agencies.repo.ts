import { prisma } from "../../Frameworks/prisma.js";
import type { IAdminAgenciesRepository } from "./admin.agencies.repository.js";

export class PrismaAdminAgenciesRepository implements IAdminAgenciesRepository {
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
}