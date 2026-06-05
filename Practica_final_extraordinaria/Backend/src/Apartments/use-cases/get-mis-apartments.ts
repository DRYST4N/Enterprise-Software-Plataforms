import type { IApartamentoRepository } from "../apartments.repository.js";

export class GetMisApartment {
    constructor(private apartmentRepository: IApartamentoRepository) {}

    async execute(agenciaId: string){
        if(!agenciaId) {
            throw new Error('El ID de la agencia es obligatorio');
        }

        return await this.apartmentRepository.findByAgencia(agenciaId);
    }
}