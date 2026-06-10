import { PrismaBookingRepository } from "./prisma-booking.repo.js";
import { setupBookingRoutes } from "./reserva.route.js";
import { controller as bookingController } from "./controllers/index.js";
import { usecase as bookingUseCases } from "./use-case/index.js";


export {
    PrismaBookingRepository as repository,
    setupBookingRoutes as router,
    bookingController as controller,
    bookingUseCases as usecase
}