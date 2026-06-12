import { BadRequestError } from "../../../middlewares/Errors/CustomErrors.js";
import type { IAdminApartmentsRepository } from "../admin.apartment.respository.js";

export class UpdateEstrellasUseCase {
    constructor(private adminRepository: IAdminApartmentsRepository) {}

    async execute(apartmentId: string, estrellas: number) {
        console.log(`[ADMIN Use Case] Actualizando las estrellas al apartamento: ${apartmentId}`);

        if(!apartmentId) throw new BadRequestError("El ID del apartamento es requerido.");

        if(estrellas < 0 || estrellas > 5){
            throw new BadRequestError("La valoración debe estar comprendida entre 0 y 5 estrellas.");
        }

        return await this.adminRepository.updateEstrellasApartments(apartmentId, estrellas);
    }
}