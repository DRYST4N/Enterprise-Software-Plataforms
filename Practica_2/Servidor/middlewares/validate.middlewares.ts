import { type Request, type Response, type NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validamos los 3 puntos de entrada posibles de datos
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(); // Si es válido, continúa al controlador
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Error de validación",
          details: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  };