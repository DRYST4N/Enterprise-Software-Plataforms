export interface TheaterDTO{
    id: number;
    nombre: string;
    capacidad: number;
}


//Para ver que peliculas hay en un cine en concreto
export interface TheaterScheduleDTO extends TheaterDTO{
    cartelera:{
        pelicula: string;
        dia: Date;
        inicio: string;
    }[];
}