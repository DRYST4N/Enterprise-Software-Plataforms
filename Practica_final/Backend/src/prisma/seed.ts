import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
    const hash = (pass: string) => bcrypt.hash(pass, 10);

      // ADMIN
    await prisma.usuario.create({
        data: {
            correo: 'admin@fest.io',
            pass: await hash('admin123'),
            role: 'ADMIN'
        }
    });

    // Empresa
    const usuarioEmpresa = await prisma.usuario.create({
        data: {
            correo: 'empresa@fest.io',
            pass: await hash('empresa123'),
            role: 'Empresa',
            empresa: {
                create: {
                    razon_social: 'Eventos Sol S.L.',
                    cif: 'B12345678',
                    domicilio_social: 'Calle Mayor 1',
                    nombre_contacto: 'Ana García',
                    telefono_contacto: '600000001',
                    estado: 'Verificado'
                }
            }
        },
        include: { empresa: true }
    });

    // Festival activo
    const festivalActivo = await prisma.festival.create({
        data: {
            nombre: 'Summer Beats 2026',
            ubicacion: 'Madrid',
            fecha_inicio: new Date('2026-08-01'),
            fecha_fin: new Date('2026-08-03'),
            artistas: ['Rosalía', 'Bad Bunny'],
            aforo: 5000,
            cancelado: false,
            empresa_id: usuarioEmpresa.empresa!.id
        }
    });

    await prisma.entrada.createMany({
        data: [
            { nombre: 'General', precio: 50, stock: 100, festival_id: festivalActivo.id },
            { nombre: 'VIP', precio: 120, stock: 20, festival_id: festivalActivo.id }
        ]
    });

    // Festival cancelado
    const festivalCancelado = await prisma.festival.create({
        data: {
            nombre: 'Winter Fest 2026',
            ubicacion: 'Barcelona',
            fecha_inicio: new Date('2026-12-20'),
            artistas: ['C. Tangana'],
            aforo: 2000,
            cancelado: true,
            empresa_id: usuarioEmpresa.empresa!.id
        }
    });

    const entradaCancelada = await prisma.entrada.create({
        data: { nombre: 'General', precio: 35, stock: 50, festival_id: festivalCancelado.id }
    });

    // Cliente con compra en el festival cancelado
    const usuarioCliente = await prisma.usuario.create({
        data: {
            correo: 'cliente@fest.io',
            pass: await hash('cliente123'),
            role: 'Cliente',
            cliente: {
                create: {
                    nombre_completo: 'Juan Pérez',
                    dni: '12345678A',
                    fecha_nacimiento: new Date('1995-05-15'),
                    telefono: '600000002'
                }
            }
        }
    });

    await prisma.checkout.create({
        data: {
            usuario_id: usuarioCliente.id,
            precio_total: 35,
            transaction_id: 'test-transaction-001',
            card_last4: '4242',
            reembolsado: false,
            ticket: {
                create: { entrada_id: entradaCancelada.id, cantidad: 1 }
            }
        }
    });

    //Empresa pendiente
    await prisma.usuario.create({
        data: {
            correo: 'pendiente@fest.io',
            pass: await hash('pendiente123'),
            role: 'Empresa',
            empresa: {
                create: {
                    razon_social: 'Eventos Luna S.L.',
                    cif: 'B87654321',
                    domicilio_social: 'Calle Luna 5',
                    nombre_contacto: 'Luis Martínez',
                    telefono_contacto: '600000003',
                }
            }
        }
    });

    await prisma.usuario.create({
        data: {
            correo: 'rechazada@fest.io',
            pass: await hash('rechazada123'),
            role: 'Empresa',
            empresa: {
                create: {
                    razon_social: 'Fraudes Corp S.L.',
                    cif: 'B11111111',
                    domicilio_social: 'Calle Falsa 123',
                    nombre_contacto: 'Pedro Ruiz',
                    telefono_contacto: '600000004',
                    estado: 'Rechazado'
                }
            }
        }
    });

    //Cliente a borrar
    await prisma.usuario.create({
        data: {
            correo: 'borrar@fest.io',
            pass: await hash('borrar123'),
            role: 'Cliente',
            cliente: {
                create: {
                    nombre_completo: 'Cliente Borrable',
                    dni: '99999999Z',
                    fecha_nacimiento: new Date('2000-01-01'),
                    telefono: '600000005'
                }
            }
        }
    });
    console.log('Seed completado');


}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());