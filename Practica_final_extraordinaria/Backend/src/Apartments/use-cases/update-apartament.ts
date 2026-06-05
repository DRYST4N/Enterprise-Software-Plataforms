import type { Apartamento } from "@prisma/client";
import type { IApartamentoRepository } from "../apartments.repository.js";
import { Apartments } from "../apartment.entity.js";
import type { UpdateApartmentInput } from "../apartment.types.js";

export class UpdateApartment {
    constructor (private apartmentRepository: IApartamentoRepository) {}

    async execute(input: UpdateApartmentInput): Promise<Apartamento> {
        console.log("[Use Case] Validando la actualizacion del apartamento.");

        const apartamentoExiste = await this.apartmentRepository.findById(input.id);
        if(!apartamentoExiste) {
            throw new Error('El alojamiento que intentas modificar no existe.');
        }

        if(apartamentoExiste.agenciaId !== input.agenciaId){
            throw new Error('No tienes permisos para modificar este alojamiento.');
        }

        return await this.apartmentRepository.update(input.id, {
            nombre: input.nombre,
            municipio: input.municipio,
            provincia: input.provincia,
            precioNoche: input.precioNoche,
            descripcion: input.descripcion
        })
    }
}