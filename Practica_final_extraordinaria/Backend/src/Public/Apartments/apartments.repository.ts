import type { Apartments } from "./apartment.entity.js";

export interface IApartamentoRepository{
    findAll(): Promise<Apartments[]>;
    findById(id: string): Promise<Apartments | null>;
    findByAgencia(agenciaId: string): Promise<Apartments[]>;
    create(data: Omit<Apartments, 'id' | 'createdAt'>): Promise<Apartments>;
    updateEstrellas(id: string, estrellas: number): Promise<Apartments>;
    delete(id: string): Promise<Apartments>;
    update(id: string, data: Omit<Apartments, 'id' | 'createdAt' | 'activo' | 'estrellas' | 'agenciaId'>): Promise<Apartments>;
    getInforme(agenciaId: string): Promise<any>;
}