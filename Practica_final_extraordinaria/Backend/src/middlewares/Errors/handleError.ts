import { AppError } from "./appError.js";
import { logger } from "../../Frameworks/logger.js";

interface ErrorResponse {
    status: 'error' | 'fail';
    statusCode: number;
    message: string;
}

export const handleError = (error: unknown): ErrorResponse => {
    if(error instanceof AppError){
        if(!error.isOperational){
            logger.error('Error crítico no operacional: ', error);
        }
        return {
            status: error.statusCode >= 500 ? 'error': 'fail',
            statusCode: error.statusCode,
            message: error.message,
        };
    }

    if(error instanceof Error){
        logger.error('Error nativo de JS: ', error.message, error.stack);
        return{
            status: 'error',
            statusCode: 500,
            message: 'Algo salió muy mal en el servidor.',
        };
    }

    logger.error(' Error de origen desconocido: ', error);
    return{
        status: 'error',
        statusCode: 500,
        message: 'Ocurrió un error inesperado.',
    };
}