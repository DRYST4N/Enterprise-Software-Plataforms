import type { Role } from "@prisma/client";
import type { UserProps } from "./auth.type.js";

export class UserEntity {
    public readonly id: string | undefined;
    public email: string;
    public passwordHash: string;
    public role: Role;
    
    public nombreApellidos: string | undefined;
    public dni: string | undefined;
    public fechaNacimiento: Date | undefined;

    public razonSocial: string | undefined;
    public cif: string | undefined;
    public domicilioSocial: string | undefined;
    public nombreContacto: string | undefined;
    public verificado: boolean;
    public bloqueado: boolean;
    public telefono: string | undefined;

    constructor(props: UserProps){
        this.id = props.id;
        this.email = props.email;
        this.passwordHash = props.passwordHash;
        this.role = props.role;

        this.nombreApellidos = props.nombreApellidos;
        this.dni = props.dni;
        this.fechaNacimiento = props.fechaNacimiento;

        this.razonSocial = props.razonSocial;
        this.cif = props.cif;
        this.domicilioSocial = props.domicilioSocial;
        this.nombreContacto = props.nombreContacto;
        this.verificado = props.verificada ?? false;
        this.bloqueado = props.bloqueada ?? false;

        this.telefono = props.telefono;
    }

}