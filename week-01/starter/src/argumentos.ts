export function obtenerFiltroTratamiento(): string | undefined {
  const args = process.argv.slice(2);
  const indice = args.indexOf("--category");
  if (indice === -1) return undefined;
  return args[indice + 1];
}