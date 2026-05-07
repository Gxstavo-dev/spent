import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

export const obtenerIngresos = async (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDeToken(req);

  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const consulta = await conexion.execute({
      sql: "SELECT id, monto, descripcion, fecha FROM ingresos WHERE idUsuario = ? ORDER BY fecha DESC, id DESC",
      args: [usuario.id],
    });

    const ingresos = consulta.rows.map((fila) => ({
      id: Number(fila.id),
      monto: Number(fila.monto),
      descripcion: fila.descripcion as string,
      fecha: fila.fecha as string,
    }));

    return res.status(200).json(ingresos);
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
