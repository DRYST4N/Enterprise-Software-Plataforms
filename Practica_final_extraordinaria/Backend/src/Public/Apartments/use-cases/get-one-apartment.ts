import type{ Apartamento } from "@prisma/client";
import type { IApartamentoRepository } from "../apartments.repository.js";

export class GetOneApartment {
    constructor(private apartmentRepository: IApartamentoRepository) {}

    async execute( id: string): Promise<Apartamento> {
        console.log("[Use Case] Solicitando el apartamento especifico.");

        const apartamento = await this.apartmentRepository.findById(id);

        if(!apartamento) {
            throw new Error('El alojamiento solicitado no existe en el sistema o ha sido borrado.');
        }

        return apartamento;
    }
}