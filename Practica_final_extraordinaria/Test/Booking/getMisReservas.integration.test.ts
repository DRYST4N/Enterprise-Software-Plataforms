import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { GetMisReservasUseCase } from '../../Backend/src/Public/Booking/use-case/get-mis-reservas.usecase.js';
import type { IBookingRepository } from '../../Backend/src/Public/Booking/booking.repository.js';

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

const { setupBookingRoutes } = await import('../../Backend/src/Public/Booking/reserva.route.js');

class FakeBookingRepository implements IBookingRepository {
    public reservas: any[] = [];

    async findFuturasPorApartamento(): Promise<any[]> {
        throw new Error('No implementado en el fake repository.');
    }
    async findApartamentoActivo(): Promise<any | null> {
        throw new Error('No implementado en el fake repository.');
    }
    async comprobarConflictoFechas(): Promise<boolean> {
        throw new Error('No implementado en el fake repository.');
    }
    async createReserva(): Promise<any> {
        throw new Error('No implementado en el fake repository.');
    }
    async findReservasPorCliente(clienteId: string): Promise<any[]> {
        return this.reservas.filter((reserva) => reserva.clienteId === clienteId);
    }
}

const buildApp = (repository: IBookingRepository) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            BookingUseCases: {
                getMisReservas: new GetMisReservasUseCase(repository),
            },
        },
    };

    app.use('/api/booking', setupBookingRoutes(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
};

const clienteUser = {
    role: 'CLIENTE',
    cliente: { id: 'cliente-1' },
};

const agenciaUser = {
    role: 'AGENCIA',
    agencia: { id: 'agencia-1' },
};

const seedReserva = (repository: FakeBookingRepository) => {
    const reserva = {
        id: 'reserva-1',
        clienteId: 'cliente-1',
        apartamentoId: 'apartamento-1',
        checkIn: new Date('2026-07-01'),
        checkOut: new Date('2026-07-04'),
        totalNoches: 3,
        precioTotal: 150,
        transactionId: 'txn-123',
        statusPago: 'approved',
        cardHolder: 'María García López',
        apartamento: { id: 'apartamento-1', nombre: 'Apartamento Centro' },
    };
    repository.reservas.push(reserva);
    return reserva;
};

describe('GET /api/booking/mis-reservas (GetMisReservasUseCase)', () => {
    let repository: FakeBookingRepository;

    beforeEach(() => {
        repository = new FakeBookingRepository();
    });

    it('devuelve la lista de reservas del cliente con su qrValue', async () => {
        const reserva = seedReserva(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .get('/api/booking/mis-reservas')
            .set('x-mock-user', JSON.stringify(clienteUser));

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
            id: reserva.id,
            clienteId: 'cliente-1',
            precioTotal: 150,
        });
        expect(JSON.parse(response.body[0].qrValue)).toMatchObject({
            reservaId: reserva.id,
            titular: reserva.cardHolder,
            transactionId: reserva.transactionId,
            alojamiento: 'Apartamento Centro',
        });
    });

    it('devuelve una lista vacía si el cliente no tiene reservas', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .get('/api/booking/mis-reservas')
            .set('x-mock-user', JSON.stringify(clienteUser));

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const app = buildApp(repository);

        const response = await request(app).get('/api/booking/mis-reservas');

        expect(response.status).toBe(401);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol CLIENTE', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .get('/api/booking/mis-reservas')
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(403);
    });

    it('devuelve un error si el usuario no tiene un perfil de cliente asociado', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .get('/api/booking/mis-reservas')
            .set('x-mock-user', JSON.stringify({ role: 'CLIENTE' }));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El usuario debe estar autenticado.');
    });
});