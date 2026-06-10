import type { ApartmentsProps } from "./apartment.types.js";

export class Apartments {
    public readonly id?: string | undefined;
    public nombre: string;
    public municipio: string;
    public provincia: string;
    public descripcion: string;
    public precioNoche: number;
    public estrellas: number;
    public readonly agenciaId: string;
    public activo: boolean;

    constructor (props: ApartmentsProps){
        this.id = props.id;
        this.nombre = props.nombre;
        this.municipio = props.municipio;
        this.provincia = props.provincia;
        this. descripcion = props.descripcion;
        this.precioNoche = props.precioNoche;
        this.estrellas = props.estrellas ?? 0;
        this.agenciaId = props.agenciaId;
        this.activo = true;

    }

}