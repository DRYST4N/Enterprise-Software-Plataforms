export interface IApartmentRequest{
    nombre: string,
    municipio: string,
    provincia: string,
    precioNoche: number,
    descripcion: string,
    agenciaId: string,
    activo: boolean
}

export interface ApartmentsProps {
    id?: string;
    nombre: string;
    municipio: string;
    provincia: string;
    descripcion: string;
    precioNoche: number;
    estrellas?: number;
    agenciaId: string;
}

export interface UpdateApartmentInput {
    id: string;
    nombre: string;
    municipio: string;
    provincia: string;
    precioNoche: number;
    descripcion: string;
    agenciaId: string; 
}