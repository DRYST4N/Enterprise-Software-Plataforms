import { AdminControllers } from './controllers/index.js';
import { AdminUseCase } from './usecase/index.js';
import { setupAdminRoutes } from './admin.route.js';
import { PrismaAdminRepository } from './prisma-admin.repo.js';

export {
    AdminControllers as controller,
    AdminUseCase as usecase,
    setupAdminRoutes as router,
    PrismaAdminRepository as repository,

}