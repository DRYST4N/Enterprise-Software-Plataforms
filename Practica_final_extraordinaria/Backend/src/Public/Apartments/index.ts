import { PrismaApartmentRepository } from "./prisma-apartamento.repo.js";
import { setupApartmentRoutes } from './apartamentos.route.js';
import  usecases  from "./use-cases/index.js";
import  controllers  from './controllers/index.js';


export { 
    PrismaApartmentRepository as repository,
    setupApartmentRoutes as router,
    controllers,
    usecases
};