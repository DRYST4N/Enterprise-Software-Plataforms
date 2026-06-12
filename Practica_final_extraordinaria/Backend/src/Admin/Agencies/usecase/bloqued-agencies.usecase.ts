import { BadRequestError } from "../../../middlewares/Errors/CustomErrors.js";
import type { IAdminAgenciesRepository } from "../admin.agencies.repository.js";

export class BloquedAgencies {
    constructor (private adminRepository: IAdminAgenciesRepository) {};

    async execute(agenciaId: string, bloqueada: boolean) {

        if(!agenciaId) throw new BadRequestError('No existe dicha agencia.');

        return await this.adminRepository.toggleBloqueoAgencia(agenciaId, bloqueada);
    }
}