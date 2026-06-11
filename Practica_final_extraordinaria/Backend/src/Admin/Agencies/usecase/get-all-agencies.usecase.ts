import type { IAdminAgenciesRepository } from "../admin.agencies.repository.js";

export class GetAllAgencies {
    constructor(private adminRepository: IAdminAgenciesRepository) {}

    async execute() {
        console.log("[ADMIN Use Case] Solicitando la lista global de agencias.");

        return await this.adminRepository.findAllAgencias();
    }
}