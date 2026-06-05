import axios from 'axios';
import type { IPaymentService } from '../Booking/booking.repository.js';

export class AxiosPaymentService implements IPaymentService {
    private async getPasarelaToken(): Promise<string> {
        try{
            const response = await axios.post('https://webservices.samuelencinas.dev/api/auth/login', {
                username: process.env.PASARELA_USER || 'grupoX',
                password: process.env.PASARELA_PASSWORD || 'apellido'
            });
            return response.data.access_token;
        }catch(error){
            throw new Error('Error en la comunicación con el proveedor de pago.')
        }
    }

    async procesarPago(data: any) {
        const pasarelaToken = await this.getPasarelaToken();
        try{
            const response = await axios.post(
                'https://webservices.samuelencinas.dev/api/payments/charge',
                {
                    cardHolder: data.cardHolder,
                    cardNumber: data.cardNumber,
                    expiryDate: data.expiryDate,
                    cvv: data.cvv,
                    amount: data.amount,
                    currency: 'EUR',
                },
                { headers: { Authorization: `Bearer ${pasarelaToken}` } }
            );
            return response.data;
        }catch(error){
            throw new Error('La pasarela de pago externa no está disponible en este momento.');
        }
    }
}