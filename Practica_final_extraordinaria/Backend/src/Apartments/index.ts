import { PrismaApartmentRepository } from "./prisma-apartamento.repo.js";
import { setupApartmentRoutes } from './apartamentos.route.js';
import { ApartmentsUseCases } from "./use-cases/index.js";
import { controller } from './controllers/index.js';


export { 
    PrismaApartmentRepository as repository,
    setupApartmentRoutes as router,
    controller,
    ApartmentsUseCases as usecase
};