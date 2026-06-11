import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { DeleteApartment } from '../../Backend/src/Public/Apartments/use-cases/delete-apartment.js';
import { Apartments } from '../../Backend/src/Public/Apartments/apartment.entity.js';
import type { IApartamentoRepository } from '../../Backend/src/Public/Apartments/apartments.repository.js';
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

const { setupApartmentRoutes } = await import('../../Backend/src/Public/Apartments/apartamentos.route.js');

class FakeApartmentRepository implements IApartamentoRepository {
    public apartments: Apartments[] = [];

    async findAll(): Promise<Apartments[]> {
        return this.apartments;
    }
    async findById(id: string): Promise<Apartments | null> {
        return this.apartments.find((apto) => apto.id === id) ?? null;
    }
    async findByAgencia(agenciaId: string): Promise<Apartments[]> {
        return this.apartments.filter((apto) => apto.agenciaId === agenciaId);
    }
    async create(data: Omit<Apartments, 'id' | 'createdAt'>): Promise<Apartments> {
        const apartment = new Apartments({ ...data, id: `apartamento-${this.apartments.length + 1}` });
        this.apartments.push(apartment);
        return apartment;
    }
    async updateEstrellas(): Promise<Apartments> {
        throw new Error('No implementado en el fake repository.');
    }
    async delete(id: string): Promise<Apartments> {
        const apto = this.apartments.find((a) => a.id === id);
        if (!apto) throw new Error('Apartamento no encontrado en el fake repository.');
        apto.activo = false;
        return apto;
    }
    async update(): Promise<Apartments> {
        throw new Error('No implementado en el fake repository.');
    }
    async getInforme(): Promise<any> {
        return [];
    }
}

class FakeBookingRepository implements IBookingRepository {
    constructor(public reservasFuturas: any[] = []) {}

    async findFuturasPorApartamento(): Promise<any[]> {
        return this.reservasFuturas;
    }
    async findApartamentoActivo(): Promise<any | null> {
        return null;
    }
    async comprobarConflictoFechas(): Promise<boolean> {
        return false;
    }
    async createReserva(data: any): Promise<any> {
        return data;
    }
    async findReservasPorCliente(): Promise<any[]> {
        return [];
    }
}

const buildApp = (apartmentRepository: IApartamentoRepository, bookingRepository: IBookingRepository) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            ApartmentUseCases: {
                deleteApartment: new DeleteApartment(apartmentRepository, bookingRepository),
            },
        },
    };

    app.use('/api/apartments', setupApartmentRoutes(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
};

const agenciaUser = {
    role: 'AGENCIA',
    agencia: { id: 'agencia-1' },
};

const clienteUser = {
    role: 'CLIENTE',
};

const seedApartment = (repository: FakeApartmentRepository, overrides: Partial<{ id: string; agenciaId: string }> = {}) => {
    const apartment = new Apartments({
        id: overrides.id ?? 'apartamento-1',
        nombre: 'Apartamento Centro',
        descripcion: 'Acogedor apartamento en el centro histórico.',
        municipio: 'Salamanca',
        provincia: 'Salamanca',
        precioNoche: 75,
        agenciaId: overrides.agenciaId ?? 'agencia-1',
    });
    repository.apartments.push(apartment);
    return apartment;
};

describe('DELETE /api/apartments/:id (DeleteApartment)', () => {
    let apartmentRepository: FakeApartmentRepository;

    beforeEach(() => {
        apartmentRepository = new FakeApartmentRepository();
    });

    it('da de baja el apartamento y devuelve 200 cuando pertenece a la agencia y no hay reservas conflictivas', async () => {
        const apartment = seedApartment(apartmentRepository);
        const app = buildApp(apartmentRepository, new FakeBookingRepository([]));

        const response = await request(app)
            .delete(`/api/apartments/${apartment.id}`)
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(' Alojamiento dado de baja con éxito.');
        expect(apartment.activo).toBe(false);
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const apartment = seedApartment(apartmentRepository);
        const app = buildApp(apartmentRepository, new FakeBookingRepository([]));

        const response = await request(app).delete(`/api/apartments/${apartment.id}`);

        expect(response.status).toBe(401);
        expect(apartment.activo).toBe(true);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol AGENCIA', async () => {
        const apartment = seedApartment(apartmentRepository);
        const app = buildApp(apartmentRepository, new FakeBookingRepository([]));

        const response = await request(app)
            .delete(`/api/apartments/${apartment.id}`)
            .set('x-mock-user', JSON.stringify(clienteUser));

        expect(response.status).toBe(403);
        expect(apartment.activo).toBe(true);
    });

    it('devuelve un error si el apartamento no existe', async () => {
        const app = buildApp(apartmentRepository, new FakeBookingRepository([]));

        const response = await request(app)
            .delete('/api/apartments/no-existe')
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Alojamiento no existe.');
    });

    it('devuelve un error si el apartamento pertenece a otra agencia', async () => {
        const apartment = seedApartment(apartmentRepository, { agenciaId: 'agencia-2' });
        const app = buildApp(apartmentRepository, new FakeBookingRepository([]));

        const response = await request(app)
            .delete(`/api/apartments/${apartment.id}`)
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No tienes permisos para eliminar este apartamento.');
        expect(apartment.activo).toBe(true);
    });

    it('devuelve un error si existen reservas conflictivas en los próximos 3 días', async () => {
        const apartment = seedApartment(apartmentRepository);
        const app = buildApp(apartmentRepository, new FakeBookingRepository([{ id: 'reserva-1' }]));

        const response = await request(app)
            .delete(`/api/apartments/${apartment.id}`)
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No se puede dar de baja este alojamoento: existen reservas activas o estan programadas para los 3 proximos días.');
        expect(apartment.activo).toBe(true);
    });
});
