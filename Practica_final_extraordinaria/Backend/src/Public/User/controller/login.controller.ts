import type { Request, Response, NextFunction } from "express";

export const LoginController = (dependencies: any) => {
    const { usecases: { AuthUsecases: { login } } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            console.log("[Controller] Intento de login.");

            const { email, password } = req.body;

            const loginResult = await login.execute({
                email,
                passwordPlano: password
            });

            return res.status(200).json(loginResult);
        }catch(error: any){
            next(error);
        }
    }
}