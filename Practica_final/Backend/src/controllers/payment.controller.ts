import { Request, Response } from "express";
import { EntradaService } from "../services/entrada.service";
import { PaymentSchema } from "../schemas/payment.schema";
import { CheckoutService } from "../services/checkout.service";

interface CartItem{
    entrada_id: number,
    cantidad: number
}

export const PaymentAplication = async (req: Request, res: Response) => {
    try{
        const carrito = PaymentSchema.parse(req.body)
        const total = await calculadorTotalCarrito(carrito.items);

        const peticionCuerpo = {
            "cardHolder": carrito.cardHolder,
            "cardNumber": carrito.cardNumber,
            "expiryDate": carrito.expirateDate,
            "cvv": carrito.cvv,
            "amount": total,
            "currency": "EUR"
        };

        const respuesta = await fetch('https://webservices.samuelencinas.dev/api/payments/charge', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${process.env.API_KEY}`
            },
            body: JSON.stringify(peticionCuerpo)
        });

        const result = await respuesta.json();

        if(result.status === 'decline'){
            return res.status(500).json({ error: 'Error en la pasarela de pago'});
        }
        const checkoutDTO = {
            usuario_id: (req as any).user.id,
            precio_total: Number(total),
            transaction_id: result.transaction_id,
            card_last4: carrito.cardNumber.slice(-4),
            items: carrito.items
        };

        const prismaResult = await CheckoutService.create(checkoutDTO)
        res.status(200).json({status: 'success', data: prismaResult});
    }catch(error: any){
        res.status(500).json({ error: error.message});
    }
};


async function calculadorTotalCarrito(items: CartItem[]): Promise<number> {
    const promesasPrecios = items.map(async (item) => {
        const entrada = await EntradaService.getById(item.entrada_id);
        if(entrada?.stock === 0  || Number(entrada?.stock) < item.cantidad){
            throw new Error("No quedan entradas de este tipo");
        }
        const precio = Number(entrada?.precio);
        return precio * item.cantidad;
    });
    const subtotales = await Promise.all(promesasPrecios);

    const total = subtotales.reduce((acc, current) => acc + current, 0);

    return total;
};


export const getMisCompras = async (req: Request, res: Response) => {
    try{
        const usuario_id = (req as any).user.id;
        const datos = await CheckoutService.getMisCompras(usuario_id);
        if(datos.length === 0) {
            return res.status(404).json({message: 'Datos no encotrados'});
        };
        return res.status(200).json(datos);
    }catch(error: any){
        return res.status(500).json({error: error.message})
    }
}


export const procesarReembolso = async (req: Request, res: Response) => {
    try{
        const checkoutId = Number(req.params.id);
        const usuario_id = (req as any).user.id;
        const resultado = await CheckoutService.reembolsar(checkoutId, usuario_id);
        return res.json(resultado);
    }catch(error: any){
        return res.status(400).json({ error: error.message });
    }
};
