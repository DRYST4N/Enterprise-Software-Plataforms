import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import type { IBookingRepository, IPaymentService } from '../../Backend/src/Public/Booking/booking.repository.js';

// El middleware de autenticacion real depende de Passport + Prisma, asi que en este
// test de integracion lo sustituimos por uno que lee el usuario desde una cabecera.
jest.unstable_mockModule('../../Backend/src/middlewares/auth.middlewares.js', () => ({
    RequireAuth: (req: Request, res: Response, next: NextFunction) => {
        const mockUser = req.header('x-mock-user');
        if (!mockUser) {
            return res.status(401).json({ error: 'No autorizado: Token inválido, expirado o ausente.' });
        }
        (req as any).user = JSON.parse(mockUser);
        next();
    },
    checkRole: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Acceso denegado: No tienes permisos suficientes para realizar esa acción.' });
        }
        next();
    },
}));

// El cifrado de los datos de la tarjeta es responsabilidad del Frontend; en este test
// de integracion lo sustituimos por un paso directo para centrarnos en la logica de la reserva.
jest.unstable_mockModule('../../Backend/src/Frameworks/crypto.js', () => ({
    decrypt: (text: string) => text,
}));

const { setupBookingRoutes } = await import('../../Backend/src/Public/Booking/reserva.route.js');
const { CreateBookingUseCase } = await import('../../Backend/src/Public/Booking/use-case/create-booking.usecase.js');

class FakeBookingRepository implements IBookingRepository {
    public apartamentos = new Map<string, any>();
    public hayConflicto = false;
    public reservas: any[] = [];
    private nextId = 1;

    async findFuturasPorApartamento(): Promise<any[]> {
        throw new Error('No implementado en el fake repository.');
    }
    async findApartamentoActivo(id: string): Promise<any | null> {
        return this.apartamentos.get(id) ?? null;
    }
    async comprobarConflictoFechas(): Promise<boolean> {
        return this.hayConflicto;
    }
    async createReserva(data: any): Promise<any> {
        const apartamento = this.apartamentos.get(data.apartamentoId);
        const reserva = {
            id: `reserva-${this.nextId++}`,
            ...data,
            apartamento: { id: apartamento.id, nombre: apartamento.nombre },
        };
        this.reservas.push(reserva);
        return reserva;
    }
    async findReservasPorCliente(): Promise<any[]> {
        throw new Error('No implementado en el fake repository.');
    }
}

class FakePaymentService implements IPaymentService {
    public response: { status: string; transactionId: string; cardLast4: string } = {
        status: 'approved',
        transactionId: 'txn-123',
        cardLast4: '3456',
    };

    async procesarPago(): Promise<{ status: string; transactionId: string; cardLast4: string }> {
        return this.response;
    }
}

const buildApp = (repository: IBookingRepository, paymentService: IPaymentService) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            BookingUseCases: {
                createReserva: new CreateBookingUseCase(repository, paymentService),
            },
        },
    };

    app.use('/api/booking', setupBookingRoutes(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
};

const APARTAMENTO_ID = '11111111-1111-4111-8111-111111111111';

const clienteUser = {
    role: 'CLIENTE',
    cliente: { id: 'cliente-1' },
};

const agenciaUser = {
    role: 'AGENCIA',
    agencia: { id: 'agencia-1' },
};

const validReserva = {
    apartamentoId: APARTAMENTO_ID,
    checkIn: '2026-07-01',
    checkOut: '2026-07-04',
    cardHolder: 'María García López',
    cardNumber: '1234567890123456',
    cvv: '123',
    expiryDate: '12/30',
};

const seedApartamento = (repository: FakeBookingRepository, overrides: Partial<{ precioNoche: number }> = {}) => {
    repository.apartamentos.set(APARTAMENTO_ID, {
        id: APARTAMENTO_ID,
        nombre: 'Apartamento Centro',
        precioNoche: overrides.precioNoche ?? 50,
        activo: true,
    });
};

describe('POST /api/booking (CreateBookingUseCase)', () => {
    let repository: FakeBookingRepository;
    let paymentService: FakePaymentService;

    beforeEach(() => {
        repository = new FakeBookingRepository();
        paymentService = new FakePaymentService();
    });

    it('crea la reserva, procesa el pago y devuelve 201', async () => {
        seedApartamento(repository);
        const app = buildApp(repository, paymentService);

        const response = await request(app)
            .post('/api/booking')
            .set('x-mock-user', JSON.stringify(clienteUser))
            .send(validReserva);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Reserva confirmada y pago aprobado con éxito.');
        expect(response.body.reserva).toMatchObject({
            clienteId: 'cliente-1',
            apartamentoId: APARTAMENTO_ID,
            totalNoches: 3,
            precioTotal: 150,
            transactionId: 'txn-123',
        });
        expect(JSON.parse(response.body.qrValue)).toMatchObject({
            reservaId: response.body.reserva.id,
            titular: validReserva.cardHolder,
            transactionId: 'txn-123',
            alojamiento: 'Apartamento Centro',
        });
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        seedApartamento(repository);
        const app = buildApp(repository, paymentService);

        const response = await request(app)
            .post('/api/booking')
            .send(validReserva);

        expect(response.status).toBe(401);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol CLIENTE', async () => {
        seedApartamento(repository);
        const app = buildApp(repository, paymentService);

        const response = await request(app)
            .post('/api/booking')
            .set('x-mock-user', JSON.stringify(agenciaUser))
            .send(validReserva);

        expect(response.status).toBe(403);
    });

    it('devuelve 400 si la validación del DTO falla', async () => {
        seedApartamento(repository);
        const app = buildApp(repository, paymentService);
        const { cardNumber, ...invalidReserva } = validReserva;

        const response = await request(app)
            .post('/api/booking')
            .set('x-mock-user', JSON.stringify(clienteUser))
            .send(invalidReserva);

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('devuelve 400 si la tarjeta de crédito está caducada', async () => {
        seedApartamento(repository);
        const app = buildApp(repository, paymentService);

        const response = await request(app)
            .post('/api/booking')
            .set('x-mock-user', JSON.stringify(clienteUser))
            .send({ ...validReserva, expiryDate: '01/20' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('La tarjeta de crédito está caducada.');
    });

    it('devuelve un error si el apartamento no existe o no está activo', async () => {
        const app = buildApp(repository, paymentService);

        const response = await request(app)
            .post('/api/booking')
            .set('x-mock-user', JSON.stringify(clienteUser))
            .send(validReserva);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El apartamento solicitado no existe o no está activo.');
    });

    it('devuelve un error si el apartamento no está disponible en esas fechas', async () => {
        seedApartamento(repository);
        repository.hayConflicto = true;
        const app = buildApp(repository, paymentService);

        const response = await request(app)
            .post('/api/booking')
            .set('x-mock-user', JSON.stringify(clienteUser))
            .send(validReserva);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El apartamento no está disponible en las fechas actuales seleccionadas.');
    });

    it('devuelve un error si el pago es rechazado', async () => {
        seedApartamento(repository);
        paymentService.response = { status: 'declined', transactionId: '', cardLast4: '' };
        const app = buildApp(repository, paymentService);

        const response = await request(app)
            .post('/api/booking')
            .set('x-mock-user', JSON.stringify(clienteUser))
            .send(validReserva);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('La transacción ha sido rechazada por fondos insuficienteso tarjeta inválida');
    });
});