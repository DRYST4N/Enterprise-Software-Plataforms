import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import jwt from 'jsonwebtoken';
import { RegistroSchema } from '../schemas/auth.schema';

export const login = async (req: Request, res: Response) => {
    const { correo, pass}  = req.body;

    try{
        const user  = await UsuarioService.findByEmail(correo);
        if(!user) return res.status(401).json({ message: "Credenciales invalidas "});

        const isMatch = await UsuarioService.comparePassword(pass, user.pass);
        if (!isMatch) return res.status(401).json({ message: "Credenciales invalidas "});

        const token = jwt.sign(
            {id: user.id, correo: user.correo, role: user.role},
            process.env.JWT_SECRET || 'mi_clave_super_secreta',
            {expiresIn: '8h'}
        );

        res.json({ token, role: user.role});
    } catch(error){
        res.status(500).json({ error: "Error en el login "});
    }
};

export const register = async(req: Request, res: Response ) => {
    try{
        const validateData = RegistroSchema.parse(req.body);

        const user = await UsuarioService.registrar(validateData);

        res.status(201).json({
            message: "Usuario creado correctamente.",
            userId: user.id
        });
    }catch(error: any){
        if(error.name === 'ZodError'){
            return res.status(400).json({ errors: error.errors });
        }
        if (error.code === 'P2002') {
        return res.status(400).json({ error: "El correo, DNI o CIF ya están registrados" });
        }
        res.status(500).json({ error: "Error en el servidor durante el registro" });
    }
};