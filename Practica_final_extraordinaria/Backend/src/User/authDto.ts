import { z } from 'zod';

export const RegistrarClienteSchema = z.object({
    email: z.string().email('El formato del correo electrónico no es válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    nombreApellidos: z.string().min(1, ' El nombre y apellidos son obligatorios'),
    dni: z.string().min(1, 'El DNI es obligatorio'),
    telefono: z.string().min(1, 'El telefono es obligatorio'),
    fechaNacimiento: z.string().transform((val, ctx) => {
        const fecha = new Date(val);
        if(isNaN(fecha.getTime())){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'La fecha de nacimiento no es válida',
            });
            return z.NEVER;
        }
        const hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const mes = hoy.getMonth() - fecha.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())){
            edad--;
        }
        if (edad < 18 ){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Los menores de edad no pueden registrarse en la plataforma',
            });
            return z.NEVER;
        }
        if (edad > 100 ){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Demasiado mayor como para estar vivo e irte de vacaciones',
            });
            return z.NEVER;
        }
        return fecha;
    })
});

export const RegistrarAgenciaSchema = z.object({
    email: z.string().email('El formato del correo electrónico no es válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    razonSocial: z.string().min(1, 'La razón social es obligatoria'),
    cif: z.string().min(1, 'El CIF es obligatorio'),
    domicilioSocial: z.string().min(1, 'El domicilio social es obligatorio'),
    nombreContacto: z.string().min(1, 'El nombre de la persona de contacto es obligatorio'),
    telefono: z.string().min(1, 'El teléfono de contacto es obligatorio'),
});

export type RegistrarClienteInput = z.infer<typeof RegistrarClienteSchema>;
export type RegistrarAgenciaInput = z.infer<typeof RegistrarAgenciaSchema>;