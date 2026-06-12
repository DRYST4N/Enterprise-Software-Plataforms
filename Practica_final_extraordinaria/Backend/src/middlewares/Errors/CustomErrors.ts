import { AppError } from "./appError.js";

export class NotFoundError extends AppError{ 
    constructor(message: string = 'Recurso no encontrado'){
        super(message, 404);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError{
    constructor(message: string = 'No autorizado'){
        super(message, 401);
    }
}
