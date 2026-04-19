import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

//Todos los cines disponibles
export const getAllTheaters = async () =>{
    return await prisma.theater.findMany();
};

//Peliculas disponibles en cada cine
export const getTheaterSchedule = async (theaterId: number) => {
    return await prisma.show_timing.findMany({
        where:{
            theater_id: theaterId
        },
        include: {
            movie: true,
            timeslot: true
        }
    })
};

//Filtrado por horarios
export const findTheatersByDateAndTimeRange = async (date:string, start: string, end: string) => {
    return await prisma.theater.findMany({
        where:{
            show_timing:{
                some:{
                    day: new Date(date),
                    timeslot:{
                        start_time: {gte: start},
                        end_time: {lte: end}
                    }
                }
            }
        },
        distinct: ['id']
    });
};

//Creacion de Cines

export const createTheater = async (name: string, capacity: number) => {
    return await prisma.theater.create({
        data: { name, capacity }
    });
};

//Modificar cines
export const updateTheater = async (id: number, name: string, capacity: number) => {
    return await prisma.theater.update({
        where: { id },
        data: { name, capacity }
    });
};

//Borrar cines
export const deleteTheater = async (id: number) => {
    return await prisma.theater.delete({
        where: { id }
    });
};

//Devolver un cine
export const findTheaterUnique = async(id: number) => {
    return await prisma.theater.findUnique({
        where: { id }
    });
}