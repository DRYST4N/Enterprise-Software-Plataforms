import type { Request, Response, NextFunction } from "express";
import { handleError } from "./handleError.js";

export const errorHandlerMiddleware = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const formattedError = handleError(error);
    
    res.status(formattedError.statusCode).json(formattedError);
}