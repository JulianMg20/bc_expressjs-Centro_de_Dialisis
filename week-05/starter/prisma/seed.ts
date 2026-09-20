import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hemodialisis = await prisma.tipoTratamiento.upsert({
    where: { nombre: "Hemodiálisis" },
    update: {},
    create: { nombre: "Hemodiálisis", descripcion: "Filtrado de sangre mediante máquina" },
  });

  const peritoneal = await prisma.tipoTratamiento.upsert({
    where: { nombre: "Diálisis Peritoneal" },
    update: {},
    create: { nombre: "Diálisis Peritoneal", descripcion: "Filtrado a través del peritoneo" },
  });

  const hemodiafiltracion = await prisma.tipoTratamiento.upsert({
    where: { nombre: "Hemodiafiltración" },
    update: {},
    create: { nombre: "Hemodiafiltración", descripcion: "Combinación de hemodiálisis y filtración" },
  });

  const pacientesDemo = [
    { nombre: "Carlos Ramírez", turno: "mañana", costoSesion: 185000, diasPorSemana: 3, activo: true, tipoTratamientoId: hemodialisis.id },
    { nombre: "Ana Torres", turno: "tarde", costoSesion: 210000, diasPorSemana: 7, activo: true, tipoTratamientoId: peritoneal.id },
    { nombre: "Luis Fernández", turno: "noche", costoSesion: 240000, diasPorSemana: 3, activo: false, tipoTratamientoId: hemodiafiltracion.id },
    { nombre: "María Gómez", turno: "tarde", costoSesion: 175000, diasPorSemana: 3, activo: true, tipoTratamientoId: hemodialisis.id },
    { nombre: "Jorge Salazar", turno: "mañana", costoSesion: 190000, diasPorSemana: 3, activo: true, tipoTratamientoId: hemodialisis.id },
  ];

  for (const paciente of pacientesDemo) {
    const existente = await prisma.paciente.findFirst({ where: { nombre: paciente.nombre } });
    if (!existente) {
      await prisma.paciente.create({ data: paciente });
    }
  }

  console.log("✅ Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });