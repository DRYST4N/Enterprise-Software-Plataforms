
export interface CheckoutDTO{
    usuario_id: number;
    precio_total: number;
    transaction_id: string;
    card_last4: string;
    items: { entrada_id: number; cantidad: number}[];
};