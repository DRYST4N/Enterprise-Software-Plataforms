import { prisma } from "../../Frameworks/prisma.js";
import type { IAdminApartmentsRepository } from "./admin.apartment.respository.js";


export class PrismaAdminApartmentRepository implements IAdminApartmentsRepository {
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