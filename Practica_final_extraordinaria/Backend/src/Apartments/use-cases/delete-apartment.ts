import type { IBookingRepository } from "../../Booking/booking.repository.js";
import type{ IApartamentoRepository } from "../apartments.repository.js";

export class DeleteApartment {
    constructor(private apartmentRepository: IApartamentoRepository, private bookingRepository: IBookingRepository) {}
    
    async execute(id: string, agenciaId: string){
        const apto = await this.apartmentRepository.findById(id);
        if(!apto) throw new Error('Alojamiento no existe.');
        if(apto.agenciaId !== agenciaId) throw new Error('No tienes permisos para eliminar este apartamento.');

        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 3);

        const reservasConflictivas = await this.bookingRepository.findFuturasPorApartamento(id, fechaLimite);

        if(reservasConflictivas.length > 0) {
            throw new Error('No se puede dar de baja este alojamoento: existen reservas activas o estan programadas para los 3 proximos días.');
        }

        return await this.apartmentRepository.delete(id);
    }
}