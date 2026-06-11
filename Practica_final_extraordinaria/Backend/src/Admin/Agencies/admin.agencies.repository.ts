import type { Agencia } from "@prisma/client";

export interface IAdminAgenciesRepository {
    updateVerificacionAgencia(agenciaId: string, verificada: boolean): Promise<Agencia>;
    toggleBloqueoAgencia(agenciaId: string, bloqueada: boolean): Promise<Agencia>;
    findAllAgencias(): Promise<any[]>;
}