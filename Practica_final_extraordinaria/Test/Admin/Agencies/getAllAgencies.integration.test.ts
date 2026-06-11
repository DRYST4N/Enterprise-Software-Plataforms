import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { GetAllAgencies } from '../../../Backend/src/Admin/Agencies/usecase/get-all-agencies.usecase.js';
import { VerifyAgencyUseCase } from '../../../Backend/src/Admin/Agencies/usecase/verify-agency.usecase.js';
import type { IAdminAgenciesRepository } from '../../../Backend/src/Admin/Agencies/admin.agencies.repository.js';

// El middleware de autenticacion real depende de Passport + Prisma, asi que en este
// test de integracion lo sustituimos por uno que lee el usuario desde una cabecera.
jest.unstable_mockModule('../../../Backend/src/middlewares/auth.middlewares.js', () => ({
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

const { RequireAuth, checkRole } = await import('../../../Backend/src/middlewares/auth.middlewares.js');
const { setupAdminAgenciesRouter } = await import('../../../Backend/src/Admin/Agencies/agencies.route.js');

class FakeAdminAgenciesRepository implements IAdminAgenciesRepository {
    public agencias: any[] = [];
    public shouldThrow = false;

    async findAllAgencias(): Promise<any[]> {
        if (this.shouldThrow) {
            throw new Error('Error al recuperar las agencias.');
        }
        return this.agencias;
    }
    async updateVerificacionAgencia(): Promise<any> {
        throw new Error('No implementado en el fake repository.');
    }
    async toggleBloqueoAgencia(): Promise<any> {
        throw new Error('No implementado en el fake repository.');
    }
}

const buildApp = (repository: IAdminAgenciesRepository) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            AdminAgenciesUseCases: {
                getAllAgencies: new GetAllAgencies(repository),
                verifyAgency: new VerifyAgencyUseCase(repository),
            },
        },
    };

    app.use(RequireAuth, checkRole(['ADMIN']));
    app.use('/agencies', setupAdminAgenciesRouter(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
};

const adminUser = { role: 'ADMIN' };
const agenciaUser = { role: 'AGENCIA', agencia: { id: 'agencia-1' } };

const seedAgencia = (repository: FakeAdminAgenciesRepository) => {
    const agencia = {
        id: 'agencia-1',
        userId: 'user-1',
        razonSocial: 'Hoteles Castilla S.L.',
        cif: 'B12345678',
        domicilioSocial: 'Calle Mayor 1, Salamanca',
        nombreContacto: 'Juan Pérez',
        telefono: '600123456',
        verificada: false,
        bloqueada: false,
    };
    repository.agencias.push(agencia);
    return agencia;
};

describe('GET /agencies (Admin GetAllAgencies)', () => {
    let repository: FakeAdminAgenciesRepository;

    beforeEach(() => {
        repository = new FakeAdminAgenciesRepository();
    });

    it('devuelve la lista de todas las agencias para un administrador', async () => {
        const agencia = seedAgencia(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .get('/agencies')
            .set('x-mock-user', JSON.stringify(adminUser));

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
            id: agencia.id,
            razonSocial: agencia.razonSocial,
            cif: agencia.cif,
        });
    });

    it('devuelve una lista vacía si no hay agencias registradas', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .get('/agencies')
            .set('x-mock-user', JSON.stringify(adminUser));

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const app = buildApp(repository);

        const response = await request(app).get('/agencies');

        expect(response.status).toBe(401);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol ADMIN', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .get('/agencies')
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(403);
    });

    it('propaga el error si el repositorio falla al recuperar las agencias', async () => {
        repository.shouldThrow = true;
        const app = buildApp(repository);

        const response = await request(app)
            .get('/agencies')
            .set('x-mock-user', JSON.stringify(adminUser));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Error al recuperar las agencias.');
    });
});