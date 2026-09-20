-- CreateTable
CREATE TABLE "TipoTratamiento" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "TipoTratamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "turno" TEXT NOT NULL,
    "costoSesion" DOUBLE PRECISION NOT NULL,
    "diasPorSemana" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoTratamientoId" UUID NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoTratamiento_nombre_key" ON "TipoTratamiento"("nombre");

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_tipoTratamientoId_fkey" FOREIGN KEY ("tipoTratamientoId") REFERENCES "TipoTratamiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
