import { setupAdminApartmentsRouter } from "./apartments.route.js";
import usecases from "./usecase";
import controllers from './controllers';
import { PrismaAdminApartmentRepository } from './prisma-admin.apartments.repo.js';


export {
    PrismaAdminApartmentRepository as repository,
    setupAdminApartmentsRouter as router,
    usecases,
    controllers
}