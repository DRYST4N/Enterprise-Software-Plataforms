-- CreateEnum
CREATE TYPE "estado_empresa" AS ENUM ('Espera', 'Verificado', 'Rechazado');

-- CreateEnum
CREATE TYPE "estado_usuario" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('Cliente', 'Empresa', 'ADMIN');

-- CreateTable
CREATE TABLE "checkout" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "precio_total" DECIMAL(10,2) NOT NULL,
    "fecha_compra" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "transaction_id" VARCHAR(255),
    "card_last4" VARCHAR(4),

    CONSTRAINT "checkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(255) NOT NULL,
    "dni" VARCHAR(255) NOT NULL,
    "fecha_nacimiento" DATE,
    "telefono" VARCHAR(20),
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresa" (
    "id" SERIAL NOT NULL,
    "razon_social" VARCHAR(255) NOT NULL,
    "cif" VARCHAR(20) NOT NULL,
    "domicilio_social" TEXT,
    "nombre_empresa" VARCHAR(255) NOT NULL,
    "nombre_contacto" VARCHAR(255),
    "telefono_contacto" VARCHAR(20),
    "usuario_id" INTEGER NOT NULL,
    "estado" "estado_empresa" DEFAULT 'Espera',

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrada" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "descripcion" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 100,
    "festival_id" INTEGER NOT NULL,

    CONSTRAINT "entrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "ubicacion" VARCHAR(255),
    "descripcion" TEXT,
    "artistas" JSONB DEFAULT '[]',
    "fecha_inicio" DATE,
    "fecha_fin" DATE,
    "imagen_path" VARCHAR(500),
    "cancelado" BOOLEAN NOT NULL DEFAULT false,
    "aforo" INTEGER,
    "empresa_id" INTEGER,

    CONSTRAINT "festival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket" (
    "id" SERIAL NOT NULL,
    "entrada_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "checkout_id" INTEGER NOT NULL,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "correo" VARCHAR(255) NOT NULL,
    "pass" VARCHAR(255) NOT NULL,
    "role" "rol_usuario" DEFAULT 'Cliente',
    "estado" "estado_usuario" DEFAULT 'Activo',

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_dni_key" ON "cliente"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_usuario_id_key" ON "cliente"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_cif_key" ON "empresa"("cif");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_usuario_id_key" ON "empresa"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- AddForeignKey
ALTER TABLE "checkout" ADD CONSTRAINT "fk_usuario_checkout" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "fk_usuario_cliente" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empresa" ADD CONSTRAINT "fk_usuario_empresa" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada" ADD CONSTRAINT "fk_festival_entrada" FOREIGN KEY ("festival_id") REFERENCES "festival"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "festival" ADD CONSTRAINT "festival_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "fk_chekout_ticket" FOREIGN KEY ("checkout_id") REFERENCES "checkout"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "fk_entrada_ticket" FOREIGN KEY ("entrada_id") REFERENCES "entrada"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
