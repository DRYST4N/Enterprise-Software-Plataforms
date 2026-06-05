import type { IAdminRepository } from "../admin.repository.js";

export class GetAllAparments{
    constructor(private adminRepository: IAdminRepository) {}

    async execute(){
        console.log("[ADMIN Use Case] Solicitando todos los alojamientos registrados.");

        return await this.adminRepository.findAllApartments();
    }
}