import type { IAdminRepository } from "../admin.repository.js";

export class UpdateEstrellasUseCase {
    constructor(private adminRepository: IAdminRepository) {}

    async execute(apartmentId: string, estrellas: number) {
        console.log(`[ADMIN Use Case] Actualizando las estrellas al apartamento: ${apartmentId}`);

        if(!apartmentId) throw new Error("El ID del apartamento es requerido.");

        if(estrellas < 0 || estrellas > 5){
            throw new Error("La valoración debe estar comprendida entre 0 y 5 estrellas.");
        }

        return await this.adminRepository.updateEstrellasApartments(apartmentId, estrellas);
    }
}