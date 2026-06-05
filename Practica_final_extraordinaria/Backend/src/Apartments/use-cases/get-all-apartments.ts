import type { Apartamento } from "@prisma/client";
import type { IApartamentoRepository } from "../apartments.repository.js";

export class GetAllAparments {
    constructor(private apartmentRepository: IApartamentoRepository) {}

    async execute(): Promise<Apartamento[]> {
        console.log(' Solicitando lista global de apartamentos');

        return await this.apartmentRepository.findAll();
    }
}