import type { Apartments } from "../../Public/Apartments/apartment.entity.js";

export interface IAdminApartmentsRepository {
    findAllApartments(): Promise<Apartments[]>;
    updateEstrellasApartments(apartmentId: string, estrellas: number): Promise<Apartments>;
}