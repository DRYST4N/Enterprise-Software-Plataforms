import { PrismaBookingRepository } from "./prisma-booking.repo.js";
import { setupBookingRoutes } from "./reserva.route.js";
import controllers from "./controllers/index.js";
import usecases from "./use-case/index.js";


export {
    PrismaBookingRepository as repository,
    setupBookingRoutes as router,
    controllers,
    usecases
}