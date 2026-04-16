import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

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