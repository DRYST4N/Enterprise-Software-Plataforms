import axios from "axios";
import prisma from "../config/db.js";
import type { CreateReservaInput } from "../dtos/reservas.dto.js";
import crypto from 'crypto';

const ALGORITMO = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'clavesecretaparaesconderlastarjet' ;
const IV_LENGTH = 16

export function decrypt(text: string): string{
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITMO, Buffer.from(SECRET_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


const getPasarelaToken = async () => {
    try{
        const response = await axios.post('https://webservices.samuelencinas.dev/api/auth/login', {
            username: process.env.PASARELA_USER || 'grupoX',
            password: process.env.PASARELA_PASSWORD ||'apellido',
        });
        return response.data.access_token;
    }catch(error){
        throw new Error('Error en la comunicacion con el proveedor de la autenticación de la pasarela.');
    }
};

export const createReservaService = async (data: CreateReservaInput, clienteId: string) => {
    const apartamento = await prisma.apartamento.findUnique({
        where: {id: data.apartamentoId, activo: true },
    });

    if(!apartamento){
        throw new Error('El apartamento solicitado no existe o no está activo.');
    }

    const conflictoFechas = await prisma.reserva.findFirst({
        where:{
            apartamentoId: data.apartamentoId,
            statusPago: 'approved',
            NOT:[
                {checkOut: {lte:data.checkIn}},
                {checkIn: {gte: data.checkOut}},
            ],
        },
    });

    if (conflictoFechas){
        throw new Error('El apartamento no está disponible en las fechas actuales seleccionadas.');
    }

    const diferenciaTiempo = data.checkOut.getTime() - data.checkIn.getTime();
    const totalNoches = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
    const precioTotal = totalNoches * apartamento.precioNoche;

    const pasarelaToken = await getPasarelaToken();

    const numeroTarjetaLimpio = decrypt(data.cardNumber);
    const cvvLimpio = decrypt(data.cvv);

    let paymentResponse;
    try{
        paymentResponse = await axios.post(
            'https://webservices.samuelencinas.dev/api/payments/charge',
            {
                cardHolder: data.cardHolder,
                cardNumber: numeroTarjetaLimpio,
                expiryDate: data.expiryDate,
                cvv: cvvLimpio,
                amount: parseFloat(precioTotal.toFixed(2)),
                currency: 'EUR',
            },
            {headers: { Authorization: `Bearer ${pasarelaToken}`}},
        );
    } catch(error){
        throw new Error('La pasarela de pagos externa no está disponible en este momento.');
    }

    const { status, transactionId, cardLast4 } = paymentResponse.data;

    if (status === 'declined'){
        throw new Error('La transacción ha sido rechazada por fondos insuficientes o tarjeta inválida');
    }

    return await prisma.reserva.create({
        data:{
            clienteId,
            apartamentoId: data.apartamentoId,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            totalNoches,
            precioTotal,
            transactionId,
            statusPago: status,
            cardLast4,
            cardHolder: data.cardHolder,
        },
        include:{
            apartamento:{
                select:{ nombre: true, provincia: true, municipio: true }
            }
        }
    });
};


//Falta comprobar que el expiryDate este en fecha 
//No podemos pasar los datos sensibles en texto plano, alguien podria interceptar las llamadas