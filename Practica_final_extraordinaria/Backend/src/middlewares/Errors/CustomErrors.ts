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

export class PaymentRequiredError extends AppError {
    constructor(message: string = 'El pago no pudo ser procesado') {
        super(message, 402);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'El recurso que intentas crear ya existe.') {
        super(message, 409);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Acceso prohibido.') {
        super(message, 403);
    }
}
