import type { IAdminRepository } from "../admin.repository.js";

export class VerifyAgencyUseCase {
    constructor(private adminRepository: IAdminRepository) {}

    async execute(agenciaId: string, aprobar: boolean) {
        console.log(`[ADMIN Use Case] Cambiando verificacion de agencia ${agenciaId}`);
        if(!agenciaId) throw new Error('El ID de la empresa es obligatorio.');
        
        return await this.adminRepository.updateVerificacionAgencia(agenciaId, aprobar);
    }
}