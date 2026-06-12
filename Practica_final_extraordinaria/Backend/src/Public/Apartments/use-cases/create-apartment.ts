import type { IApartamentoRepository } from "../apartments.repository.js";
import type { IApartmentRequest } from "../apartment.types.js";
import type { Apartments } from "../apartment.entity.js";
import { BadRequestError, UnauthorizedError } from "../../../middlewares/Errors/CustomErrors.js";

export class CreateApartment {
    constructor(private apartmentRepository: IApartamentoRepository) {}

    async execute(data: IApartmentRequest): Promise<Apartments> {
        console.log(`🎯 [Use Case] Procesando la creación del apartamento: ${data.nombre}`);

        if(!data.agenciaId){
            throw new UnauthorizedError('El usuario no está autenticado.');
        }

        //Validamos la data que entra:
        if (data.precioNoche <= 0){
            throw new BadRequestError('El precio debe ser mayor que cero.');
        }
        const provinciasValidas = ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'];
        if(!provinciasValidas.includes(data.provincia)){
            throw new BadRequestError(`la provincia ${data.provincia} no pertenece a la comunidad de Castilla y León.`);
        }

        if (!data.nombre || data.nombre.trim().length < 3){
            throw new BadRequestError(' El nombre comercial del apartamento debe tener al menos 3 caracteres.');
        }

        return await this.apartmentRepository.create({
            nombre: data.nombre,
            municipio: data.municipio,
            provincia: data.provincia,
            precioNoche: data.precioNoche,
            descripcion: data.descripcion,
            estrellas: 0,
            agenciaId: data.agenciaId,
            activo: true,
        })
    }
}