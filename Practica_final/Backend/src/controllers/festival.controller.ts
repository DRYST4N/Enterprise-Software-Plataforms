import { Request, Response} from 'express';
import { FestivalService } from '../services/festival.service';
import { comprobarFecha, CreateFestivalSchema, UpdateFestivalSchema } from '../schemas/festival.schema';

export const createFestival = async (req: Request, res: Response) => {
    try{
        const validatedData = CreateFestivalSchema.parse(req.body);
        const empresa_id = (req as any).user.empresa.id;
        const datos = {...validatedData, empresa_id: empresa_id}
        const result = await FestivalService.create(datos);
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
    const result = await FestivalService.getAll();
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
/**
 * Recibe nada y devuelve todos los festivales que se encuentren disponibles desde la fecha actual.
 */


export const getFestivalesDisponibles = async (_req: Request, res: Response) => {
    try{
        const fechaActual : Date = new Date();
        const result = await FestivalService.getDisponibles(fechaActual);
        res.status(200).json(result);
    }catch(error: any){
        if(error.name === 'ZodError'){
            return res.status(400).json({ errors: error.errors})
        }
        console.error(error);
        res.status(500).json({ error: "Error interno al mostrar los festivales"});
    }
};

/*
Recibe el id de la empresa desde el usuario que realiza la peticion, y lo envia al service para que este devuelva todos los festivales de la empresa
*/

export const getMisFestivales = async (req: Request, res: Response ) => {
    try{
        const empresaid = (req as any).user.empresa.id;
        const result = await FestivalService.getByEmpresa(empresaid);
        res.status(200).json(result);
    }catch(error: any){
        if(error.name === 'ZodError'){
            return res.status(400).json({ errors: error.errors})
        }
        console.error(error);
        res.status(500).json({ error: "Error interno al mostrar los festivales"});
    }
};

/*
Explicacion: Recibe y comprueba que el festival exista, que el usuario y el festival sean de la misma empresa y que queden mas de tres dias para el evento para luego mandarle 
el id del evento al service y que lo cancele
*/

export const cancelarFestival = async (req: Request, res: Response) => {
    try{
        const festival = await FestivalService.getById(Number(req.params.id));
        const fechaHoy = new Date();
        if(!festival) {
            return res.status(404).json({ message: 'Festival no encontrado'});
        }
        if(festival.empresa_id !== (req as any).user.empresa.id){
            return res.status(400).json({ message: 'Peticion no autorizada'});
        }
        if(!festival.fecha_inicio){
            const result = await FestivalService.cancel(festival.id);
            return res.status(200).json(result);
        }
        const diferencesMiliseconds = festival.fecha_inicio.getTime() - fechaHoy.getTime();

        const diferencesDays = diferencesMiliseconds / (1000 * 60 * 60 * 24);

        if (diferencesDays < 3) {
            return res.status(400).json({
                message: 'No se puede editar: faltan menos de 3 dias para el inicio'
            });
        };

        const result = await FestivalService.cancel(festival.id);
        res.status(200).json(result);
    }catch(error: any){
        res.status(500).json({error: error.message});
    }
};

//
//Explicacion: Recibe los parametros de la peticion request y compreba que exista el festival, que el festival y el usuario sean de la misma empresa
// ,que queden mas de tres dias para el festival y se los envia a update del servicio para que los inserte en la BD

export const editarFestival = async (req: Request, res: Response) => {
    try{
        const fechaHoy = new Date();
        const festival = await FestivalService.getById(Number(req.params.id));
        const datos = req.body;
        const validatedData = UpdateFestivalSchema.parse(datos);
        if(!festival) {
            return res.status(404).json({ message: 'Festival no encontrado'});
        }
        if(festival.empresa_id !== (req as any).user.empresa.id){
            return res.status(400).json({ message: 'Peticion no autorizada'});
        }
        if(!festival.fecha_inicio){
            const result = await FestivalService.update(festival.id, validatedData)
            return res.status(200).json(result);
        }
        const diferencesMiliseconds = festival.fecha_inicio.getTime() - fechaHoy.getTime();

        const diferencesDays = diferencesMiliseconds / (1000 * 60 * 60 * 24);

        if (diferencesDays < 3) {
            return res.status(400).json({
                message: 'No se puede editar: faltan menos de 3 dias para el inicio'
            });
        };

        const result2 = await FestivalService.update(festival.id, validatedData);
        return res.status(200).json(result2);
    }catch(error: any){
        return res.status(500).json({error: error.message});
    }
};

export const getMisVentas = async (req: Request, res: Response) => {
    try{
        const empresa_id = (req as any).user.empresa.id;
    const festivales = await FestivalService.misVentas(empresa_id);

    const estadisticas = festivales.map(festival => {
        const totales = festival.entrada.reduce((acc, ent) => {
            const cantidadTicketsEntradas = ent.ticket.reduce((sum, t) => sum + t.cantidad, 0);
            
            acc.totalEntradas += cantidadTicketsEntradas;
            acc.totalRecaudado += cantidadTicketsEntradas * Number(ent.precio);
            
            return acc;
            }, {totalEntradas: 0, totalRecaudado: 0});

            return {
                id: festival.id,
                nombre: festival.nombre,
                totalEntradas: totales.totalEntradas,
                totalRecaudado: totales.totalRecaudado,
            };
        });
        res.json(estadisticas);
    }catch{
        return res.status(500).json({ error: 'Error al calcular ventas'});
    }
};