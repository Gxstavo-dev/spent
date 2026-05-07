// importamos los tipos de express para poder usar Request y Response
import type { Request, Response } from "express";
// importamos la conexion a la base de datos para poder hacer consultas
import { conexion } from "../../lib/local/Database";
// importamos la funcion que obtiene el usuario desde el token
import { obtenerUsuarioDeToken } from "../../lib/auth";

// esta funcion se ejecuta cuando alguien hace un GET a /transacciones/gastos
export const obtenerGastos = async (req: Request, res: Response) => {
  // obtenemos el usuario actual desde el token que envio en el header
  const usuario = obtenerUsuarioDeToken(req);

  // si no hay usuario significa que el token no es valido o no envio token
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // obtenemos el filtro de categoria si viene en la url
  // ejemplo: /transacciones/gastos?categoria=Comida
  const categoria = req.query.categoria as string | undefined;

  try {
    let consulta;

    if (categoria) {
      // si hay filtro, solo traemos los gastos de esa categoria
      consulta = await conexion.execute({
        sql: "SELECT id, monto, descripcion, categoria, fecha FROM gastos WHERE idUsuario = ? AND categoria = ? ORDER BY fecha DESC, id DESC",
        args: [usuario.id, categoria],
      });
    } else {
      // si no hay filtro, traemos todos los gastos
      consulta = await conexion.execute({
        sql: "SELECT id, monto, descripcion, categoria, fecha FROM gastos WHERE idUsuario = ? ORDER BY fecha DESC, id DESC",
        args: [usuario.id],
      });
    }

    // mapeamos los resultados a un formato mas limpio
    const gastos = consulta.rows.map((fila) => ({
      id: Number(fila.id),
      monto: Number(fila.monto),
      descripcion: fila.descripcion as string,
      categoria: fila.categoria as string | null,
      fecha: fila.fecha as string,
    }));

    // devolvemos la lista de gastos
    return res.status(200).json(gastos);
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
