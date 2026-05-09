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
    }
}