export interface Agencia {
    id: string;
    razonSocial: string;
    cif: string;
    nombreContacto: string;
    verificada: boolean;
    bloqueada: boolean;
}


export interface Apartamento {
    id: string;
    nombre: string;
    municipio: string;
    provincia: string;
    precioNoche: number;
    descripcion: string;
    estrellas: number;
    agenciaId?: string;
    agencia?: {
        razonSocial: string;
    }
}

export interface Reserva {
    id: string;
    apartamentoId: string;
    fechaInicio: string;
    fechaFin: string;
    total: number;
    huespedNombre: string;
}

export interface DatosInforme{
    anio: number;
    totalIngresos: number;
    totalReservas: number;
}

export interface SystemStatus{
    apiPublica: { name: string; status: 'ONLINE' | 'OFFLINE'; message: string };
    apiPagos: { name: string; status: 'ONLINE' | 'OFFLINE'; message: string };
}