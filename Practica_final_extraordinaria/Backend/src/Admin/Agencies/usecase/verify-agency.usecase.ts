import { BadRequestError } from "../../../middlewares/Errors/CustomErrors.js";
import type { IAdminAgenciesRepository } from "../admin.agencies.repository.js";

export class VerifyAgencyUseCase {
    constructor(private adminRepository: IAdminAgenciesRepository) {}

    async execute(agenciaId: string, aprobar: boolean) {
        console.log(`[ADMIN Use Case] Cambiando verificacion de agencia ${agenciaId}`);
        if(!agenciaId) throw new BadRequestError('El ID de la empresa es obligatorio.');
        
        return await this.adminRepository.updateVerificacionAgencia(agenciaId, aprobar);
    }
}