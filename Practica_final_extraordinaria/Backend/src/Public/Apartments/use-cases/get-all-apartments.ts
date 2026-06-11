import type { Apartments } from "../apartment.entity.js";
import type { IApartamentoRepository } from "../apartments.repository.js";

export class GetAllAparments {
    constructor(private apartmentRepository: IApartamentoRepository) {}

    async execute(): Promise<Apartments[]> {
        console.log(' Solicitando lista global de apartamentos');

        return await this.apartmentRepository.findAll();
    }
}