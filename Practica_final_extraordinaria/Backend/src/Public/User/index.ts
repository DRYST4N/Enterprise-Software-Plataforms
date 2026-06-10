import { PrismaAuthRepository } from "./prisma-auth.repo.js";
import { setupAuthRoutes } from "./auth.routes.js";
import { AuthControllers } from "./controller/index.js";
import { AuthUsesCases } from "./usecase/index.js";

export {
    PrismaAuthRepository as repository,
    setupAuthRoutes as router,
    AuthControllers as controller,
    AuthUsesCases as usecase
}