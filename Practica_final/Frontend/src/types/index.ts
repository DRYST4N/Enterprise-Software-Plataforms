export interface Festival {
    id: number;
    nombre: string;
    ubicacion?: string;
    descripcion?: string;
    artistas?: string[];
    fecha_inicio?: string;
    fecha_fin?: string;
    imagen_path?: string; 
    entrada?: Entrada[];
}

export interface Entrada {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string;
    festival_id: number;
    stock: number;
}


export interface VentaFestival {
    id: number;
    nombre: string;
    totalEntradas: number;
    totalRecaudado: number;
}

export interface Ticket {
    cantidad: number;
    entrada: { 
        nombre: string;
        festival: { cancelado: boolean };
    };
}

export interface Compra {
    id: number;
    fecha_compra: string;
    precio_total: number;
    transaction_id: string;
    reembolsado: boolean;
    ticket: Ticket[];
}