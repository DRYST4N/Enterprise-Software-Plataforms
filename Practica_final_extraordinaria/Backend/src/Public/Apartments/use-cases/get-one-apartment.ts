import type { IApartamentoRepository } from "../apartments.repository.js";

export class GetOneApartment {
    constructor(private apartmentRepository: IApartamentoRepository) {}

    async execute( id: string){
        console.log("[Use Case] Solicitando el apartamento especifico.");

        if(!id) {
            throw new Error('El identificador del apartamento es obligatorio. ');
        }

        const apartamento = await this.apartmentRepository.findById(id);

        if(!apartamento) {
            throw new Error('El alojamiento solicitado no existe en el sistema o ha sido borrado.');
        }

        return apartamento;
    }
}