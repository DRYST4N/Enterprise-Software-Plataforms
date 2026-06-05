import type { IAdminRepository } from "../admin.repository.js";

export class GetAllAgencies {
    constructor(private adminRepository: IAdminRepository) {}

    async execute() {
        console.log("[ADMIN Use Case] Solicitando la lista global de agencias.");

        return await this.adminRepository.findAllAgencias();
    }
}