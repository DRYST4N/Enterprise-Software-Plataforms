export interface IBookingRepository{
    findFuturasPorApartamento(apartmentId: string, fechaLimite: Date): Promise<any[]>;
    findApartamentoActivo(id: string):Promise<any | null>;
    comprobarConflictoFechas(apartamentoId: string, checkIn: Date, checkOut: Date): Promise<boolean>;
    createReserva(data: any): Promise<any>;
    findReservasPorCliente(clienteId: string): Promise<any[]>;
}


export interface IPaymentService {
    procesarPago(data: {
        cardHolder: string,
        cardNumber: string,
        expiryDate: string,
        cvv: string;
        amount: number;
    }): Promise<{status: string; transactionId: string; cardLast4: string}>;
}