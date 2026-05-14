import prisma from "../lib/prisma";
import { CheckoutDTO } from "../dtos/checkout.dto";


export class CheckoutService {
    static async create(data:CheckoutDTO){
        return await prisma.$transaction(async (tx) =>{
            const checkout = await tx.checkout.create({
                data: {
                    usuario_id: data.usuario_id,
                    precio_total: data.precio_total,
                    transaction_id: data.transaction_id,
                    card_last4: data.card_last4,
                    ticket:{
                        create: data.items.map(item =>({
                            entrada_id: item.entrada_id,
                            cantidad: item.cantidad,
                        })),

                    },
                },
                include: {ticket: true}
            });


            await Promise.all(
                data.items.map((item) => {
                    return tx.entrada.update({
                        where: { id: item.entrada_id },
                        data: {
                            stock:{
                                decrement: item.cantidad
                            }
                        }
                    })
                })
            );
            return {checkout};
        });
    };

    static async getMisCompras(usuario_id: number){
        return await prisma.checkout.findMany({
            where: {usuario_id},
            include:{
                ticket:{
                    include:{
                        entrada: {
                            include:{ festival: true }
                        }
                    }
                }
            }
        })
    };

    static async reembolsar(checkoutId: number, usuarioId:number){
        const checkout = await prisma.checkout.findUnique({
            where: { id: checkoutId },
            include:{
                ticket: {include: { entrada: {include:{ festival: true } } } }
            }
        });

        if(!checkout) throw new Error('Checkout no encontrado');
        if(checkout.usuario_id !== usuarioId) throw new Error ('No autorizado');
        if(checkout.reembolsado) throw new Error('Ya fue rembolsado');

        const tieneFestivalCancelado = checkout.ticket.some(t => t.entrada.festival.cancelado);
        if(!tieneFestivalCancelado) throw new Error('El festival no está cancelado');

        await fetch('https://webservices.samuelencinas.dev/Payments/PaymentsController_refund', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.API_KEY}`},
            body: JSON.stringify({
                status: 'refunded',
                transactionId: checkout.transaction_id,
                amount: Number(checkout.precio_total),
                currency: 'EUR',
                timestamp: new Date().toISOString()
            })
        });

        return await prisma.checkout.update({
            where: { id: checkoutId },
            data: { reembolsado: true}
        });
    }
}