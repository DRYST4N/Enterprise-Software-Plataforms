import { AppError } from "./appError.js";

interface ErrorResponse {
    status: 'error' | 'fail';
    statusCode: number;
    message: string;
}

export const handleError = (error: unknown): ErrorResponse => {
    if(error instanceof AppError){
        if(!error.isOperational){
            console.log('Error crítico no operacional: ', error);
        }
        return {
            status: error.statusCode >= 500 ? 'error': 'fail',
            statusCode: error.statusCode,
            message: error.message,
        };
    }

    if(error instanceof Error){
        console.error('Error nativo de JS: ', error.message, error.stack);
        return{
            status: 'error',
            statusCode: 500,
            message: 'Algo salió muy mal en el servidor.',
        };
    }

    console.error(' Error de origen desconocido: ', error);
    return{
        status: 'error',
        statusCode: 500,
        message: 'Ocurrió un error inesperado.',
    };
}