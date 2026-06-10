import type { Request, Response, NextFunction } from "express";

export const LoginController = (dependencies: any) => {
    const { usecase: { login } } = dependencies;

    return {
        login: async (req: Request, res: Response, next: NextFunction) => {
            try{
                console.log("[Controller] Intento de login.");

                const { email, password } = req.body;
                if(!email || !password) {
                    return res.status(400).json({ error: 'El email y la contraseña son campos obligatorios.'});
                }

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
}