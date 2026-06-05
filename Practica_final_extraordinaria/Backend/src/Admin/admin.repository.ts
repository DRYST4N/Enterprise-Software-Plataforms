import type{ Agencia, Apartamento } from "@prisma/client";

export interface IAdminRepository {
    updateVerificacionAgencia(agenciaId: string, verificada: boolean): Promise<Agencia>;
    toggleBloqueoAgencia(agenciaId: string, bloqueada: boolean): Promise<Agencia>;
    findAllAgencias(): Promise<any[]>;
    findAllApartments(): Promise<Apartamento[]>;
    updateEstrellasApartments(apartmentId: string, estrellas: number): Promise<Apartamento>;
}