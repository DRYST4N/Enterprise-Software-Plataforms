import { Request, Response } from "express";
import { EntradaService } from "../../services/entrada.service";
import { CreateEntradaSchema } from "../../schemas/entrada.schema";


export const CreateEntrada = async (req: Request, res: Response) =>{
    try{
        const validatedData = CreateEntradaSchema.parse(req.body);
        const result = EntradaService.create(validatedData);
        res.status(201).json(result);
    }catch( error: any ){
        if(error.name === 'ZodError'){
            return res.status(400).json({errors: error.errors });
        }
        console.error(error)
        res.status(500).json({ error: "Error interno al crear la entrada"})
    }
};