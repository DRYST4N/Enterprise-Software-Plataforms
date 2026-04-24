export interface FestivalDTO{
    nombre: string;
    ubicacion?: string | null;
    descripcion?: string | null;
    artistas?: string[]; // Representación del JSON
    fecha_inicio?: Date | null;
    fecha_fin?: Date | null;
    imagen_path?: string | null;
}

export interface FestivalDTOResponseDTO extends FestivalDTO{
    id: number;
}