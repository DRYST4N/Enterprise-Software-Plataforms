import type { IBookingRepository, IPaymentService } from "../booking.repository.js";
import type { CreateReservaInput } from "../reservas.dto.js";
import { decrypt } from '../../../Frameworks/crypto.js';


export class CreateBookingUseCase {
    constructor(
        private bookingRepository: IBookingRepository,
        private paymentService: IPaymentService,
    ) {}

    async execute(data: CreateReservaInput, clienteId: string){
        console.log(`[Use Case] Procesando la reserva para el apto: ${data.apartamentoId}`);

        if(!clienteId){
            throw new Error('Acceso denegado: Se necesita un perfil de Cliente para poder reservar.');
        }

        const parts = data.expiryDate.split('/');
        const mesCaducidad = parseInt(parts[0] ||'', 10);
        const anoCaducidad = 2000 + parseInt(parts[1] || '', 10);

        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const anoActual = ahora.getFullYear();

        if(isNaN(mesCaducidad) || isNaN(anoCaducidad)){
            throw new Error(' El formato de la fecha de caducidad no es valida.');
        }

        if(anoCaducidad < anoActual || (anoCaducidad === anoActual && mesCaducidad < mesActual)){
            throw new Error('Operación rechazada: La tarjeta de crédito proporcionada está caducada.');
        }

        const apartamento = await this.bookingRepository.findApartamentoActivo(data.apartamentoId);
        if(!apartamento){
            throw new Error('El apartamento solicitado no existe o no está activo.');
        }

        const hayConflicto = await this.bookingRepository.comprobarConflictoFechas(data.apartamentoId, data.checkIn, data.checkOut);
        if(hayConflicto){
            throw new Error('El apartamento no está disponible en las fechas actuales seleccionadas.');
        }

        const diferenciaTiempo = data.checkOut.getTime() - data.checkIn.getTime();
        const totalNoches = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 *24));
        const precioTotal = totalNoches * apartamento.precioNoche;

        const numeroTarjetaLimpio = decrypt(data.cardNumber);
        const cvvLimpio = decrypt(data.cvv);

        const paymentResponse = await this.paymentService.procesarPago({
            cardHolder: data.cardHolder,
            cardNumber: numeroTarjetaLimpio,
            expiryDate: data.expiryDate,
            cvv: cvvLimpio,
            amount: parseFloat(precioTotal.toFixed(2))
        });

        if(paymentResponse.status === 'declined') {
            throw new Error('La transacción ha sido rechazada por fondos insuficienteso tarjeta inválida');
        }

        return await this.bookingRepository.createReserva({
            clienteId,
            apartamentoId: data.apartamentoId,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            totalNoches,
            precioTotal,
            transactionId: paymentResponse.transactionId,
            statusPago: paymentResponse.status,
            cardLas4: paymentResponse.cardLast4,
            cardHolder: data.cardHolder
        });
    }
}