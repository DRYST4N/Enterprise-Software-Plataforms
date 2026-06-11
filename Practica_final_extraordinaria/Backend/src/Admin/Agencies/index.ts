import { PrismaAdminAgenciesRepository } from "./prisma-admin.agencies.repo.js";
import usecases from './usecase';
import controllers from './controllers';
import { setupAdminAgenciesRouter } from "./agencies.route.js";

export {
    PrismaAdminAgenciesRepository as repository,
    usecases,
    controllers,
    setupAdminAgenciesRouter as router
}