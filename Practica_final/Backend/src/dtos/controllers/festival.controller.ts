import { Request, Response} from 'express';
import { FestivalService } from '../../services/festival.service';
import { comprobarFecha, CreateFestivalSchema } from '../../schemas/festival.schema';

export const createFestival = async (req: Request, res: Response) => {
    try{
        const validatedData = CreateFestivalSchema.parse(req.body);
        const result = await FestivalService.create(validatedData);
        res.status(201).json(result);
    }catch( error: any){
        if(error.name === 'ZodError'){
            return res.status(400).json({errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: "Error interno al crear el festival"});
    }
};

export const getFestivales = async (_req: Request, res: Response) => {
    const result = FestivalService.getAll();
    res.json(result);
};

export const getFestivalesPosibles = async (req: Request, res:Response) => {
    try{

        const validatedData = comprobarFecha.parse(req.body);
        const result = await FestivalService.getByDate(validatedData.fecha_inicio);
        res.status(201).json(result);
    }catch(error: any){
        if(error.name === 'ZodError'){
            return res.status(400).json({ errors: error.errors})
        }
        console.error(error);
        res.status(500).json({ error: "Error interno al mostrar los festivales"});
    }
};