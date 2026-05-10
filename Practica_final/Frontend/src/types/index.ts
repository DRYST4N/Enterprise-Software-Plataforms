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