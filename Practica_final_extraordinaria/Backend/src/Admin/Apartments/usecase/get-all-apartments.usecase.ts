import type { IAdminApartmentsRepository } from "../admin.apartment.respository.js";


export class GetAllAparments{
    constructor(private adminRepository: IAdminApartmentsRepository) {}

    async execute(){
        console.log("[ADMIN Use Case] Solicitando todos los alojamientos registrados.");

        return await this.adminRepository.findAllApartments();
    }
}