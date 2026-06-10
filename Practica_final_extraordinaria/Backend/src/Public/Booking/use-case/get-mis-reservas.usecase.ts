import type { IBookingRepository } from "../booking.repository.js";

export class GetMisReservasUseCase {
    constructor(private bookingRepository: IBookingRepository){}

    async execute(clienteId: string){
        if(!clienteId) throw new Error("El usuario debe estar autenticado.");
        return await this.bookingRepository.findReservasPorCliente(clienteId);
    }
}