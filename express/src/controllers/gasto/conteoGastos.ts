import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

export const conteoGastos = async (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDeToken(req);

  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const consulta = await conexion.execute({
      sql: "SELECT categoria, COUNT(*) as total FROM gastos WHERE idUsuario = ? GROUP BY categoria",
      args: [usuario.id],
    });

    const conteo: Record<string, number> = {};
    let total = 0;

    consulta.rows.forEach((fila) => {
      const cat = (fila.categoria as string) || "Sin categoria";
      const cantidad = Number(fila.total);
      conteo[cat] = cantidad;
      total += cantidad;
    });

    return res.status(200).json({ conteo, total });
  } catch (error) {
    console.error("Error al contar gastos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
