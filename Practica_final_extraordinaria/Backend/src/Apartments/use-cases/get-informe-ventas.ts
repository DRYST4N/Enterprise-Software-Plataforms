import type { IApartamentoRepository } from "../apartments.repository.js";

export class GetInformeVentas{
    constructor(private apartmentRepository: IApartamentoRepository) {}

    async execute(agenciaId: string) {
        const datosRaw = await this.apartmentRepository.getInforme(agenciaId);
        return datosRaw.map((apto: any) => {
            const ingresosTotales = apto.reservas.reduce((sum: number, res: any) => sum + res.total, 0);
            const numeroReservas = apto.reservas.length;

            return {
                apartamentoId: apto.id,
                nombre: apto.nombre,
                municipio: apto.municipio,
                totalVentas: ingresosTotales,
                totalReservas: numeroReservas,
            };
        });
    }
}