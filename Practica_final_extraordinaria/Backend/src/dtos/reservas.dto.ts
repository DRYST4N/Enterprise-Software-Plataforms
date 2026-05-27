import { z } from 'zod';

export const CreateReservaSchema = z.object({
    apartamentoId: z.string().uuid('ID del apartamento no válido.'),
    checkIn: z.string().transform((val) => new Date(val)),
    checkOut: z.string().transform((val) => new Date(val)),
    
    cardHolder: z.string().min(1, 'El nombre del titular es obligatorio.'),
    cardNumber: z.string().min(16, 'El número de la tarjeta debe tener 16 digitos'),
    cvv: z.string().min(3, 'El CVV debe tener 3 digitos').max(3),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Formato de fecha inválido (MM/AA).')
}).refine((data) => data.checkOut > data.checkIn, {
    message: 'La fecha de check-out debe ser posterior a la fecha de check-in.',
    path: ['checkOut'],
}).refine((data) => {
    const parts = data.expiryDate.split('/');

    const mesStr = parts[0] || '';
    const anoStr = parts[1] || '';


    const mesCaducidad = parseInt(mesStr, 10);
    const anoCaducidad = 2000 + parseInt(anoStr, 10);

    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anoActual = ahora.getFullYear();

    if (isNaN(mesCaducidad) || isNaN(anoCaducidad)) return false;
    if (anoCaducidad < anoActual) return false;
    if (anoCaducidad === anoActual && mesCaducidad < mesActual) return false;

    return true;
}, {
    message: 'La tarjeta de crédito está caducada.',
    path:['expiryDate']
});

export type CreateReservaInput = z.infer<typeof CreateReservaSchema>;