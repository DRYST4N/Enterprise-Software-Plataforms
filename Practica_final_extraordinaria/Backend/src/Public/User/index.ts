import { PrismaAuthRepository } from "./prisma-auth.repo.js";
import { setupAuthRoutes } from "./auth.routes.js";
import controllers from "./controller/index.js";
import usecases from "./usecase/index.js";

export {
    PrismaAuthRepository as repository,
    setupAuthRoutes as router,
    controllers,
    usecases
}