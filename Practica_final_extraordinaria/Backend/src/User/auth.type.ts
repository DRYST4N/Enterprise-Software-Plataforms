export type Role = 'ADMIN' | 'AGENCIA' | 'CLIENTE';

export interface UserProps {
    id?: string;
    email: string;
    passwordHash: string;
    role: Role;

    //Propiedades de CLIENTE
    nombreApellidos?: string;
    dni?: string;
    fechaNacimiento?: Date;

    //Propiedades de AGENCIA
    razonSocial?: string;
    cif?: string;
    domicilioSocial?: string;
    nombreContacto?: string;
    verificada?: boolean;
    bloqueada?: boolean;

    //Propiedades en comun
    telefono?: string;
}

export interface CreateAgenciaInput {
    email: string;
    passwordPlano: string;
    razonSocial: string;
    cif: string;
    domicilioSocial: string;
    nombreContacto: string;
    telefono: string;
}

export interface CreateClienteInput {
    email: string;
    passwordPlano: string;
    nombreApellidos: string;
    dni: string;
    fechaNacimiento: string | Date;
    telefono: string;
}

export interface LoginInput {
    email: string;
    passwordPlano: string;
}

export interface UpdateMisDatosInput{
    userId: string,
    role: string;
    nombreApellidos?: string;
    razonSocial?: string;
    nombreContacto?: string;
    domicilioSocial?: string;
    telefono?: string;
}