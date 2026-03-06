/*
  Warnings:

  - You are about to drop the `Factorial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Factorial";

-- CreateTable
CREATE TABLE "factorial" (
    "id" SERIAL NOT NULL,
    "base" INTEGER NOT NULL,
    "usuario" TEXT,

    CONSTRAINT "factorial_pkey" PRIMARY KEY ("id")
);
