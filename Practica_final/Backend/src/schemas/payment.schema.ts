import { z } from "zod";

export const PaymentSchema = z.object({
    items: z.array(z.object({
        entrada_id: z.number().int().positive(),
        cantidad: z.number().int().min(1)
    })).nonempty("El carrito esta vacio"),
    cardHolder: z.string().min(3, "El nombre es demasiado corto"),
    cardNumber: z.string().regex(/^\d{16}$/, "Número de tarjeta inválido"),
    expirateDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/YY requerido"),
    cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
});