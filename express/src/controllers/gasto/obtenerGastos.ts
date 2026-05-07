import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Controlador que obtiene todos los gastos del usuario autenticado (GET /transacciones/gastos)
// Parametros de consulta opcionales: ?categoria=Comida (filtra por categoria)
// Retorna: 200 con el listado de gastos, 401 si no esta autenticado
export const obtenerGastos = async (req: Request, res: Response) => {
  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Extraemos el filtro opcional de categoria desde los parametros de consulta (query string)
  // Ejemplo de uso: GET /transacciones/gastos?categoria=Comida
  const categoria = req.query.categoria as string | undefined;

  try {
    let consulta;

    // Si se especifico una categoria como filtro, consultamos solo los gastos de esa categoria
    if (categoria) {
      consulta = await conexion.execute({
        sql: "SELECT id, monto, descripcion, categoria, fecha FROM gastos WHERE idUsuario = ? AND categoria = ? ORDER BY fecha DESC, id DESC",
        args: [usuario.id, categoria],
      });
    } else {
      // Si no hay filtro, obtenemos todos los gastos del usuario
      consulta = await conexion.execute({
        sql: "SELECT id, monto, descripcion, categoria, fecha FROM gastos WHERE idUsuario = ? ORDER BY fecha DESC, id DESC",
        args: [usuario.id],
      });
    }

    // Transformamos cada fila de la base de datos a un objeto JavaScript mas limpio
    // Convertimos id y monto a numero para evitar problemas con BigInt
    const gastos = consulta.rows.map((fila) => ({
      id: Number(fila.id),
      monto: Number(fila.monto),
      descripcion: fila.descripcion as string,
      categoria: fila.categoria as string | null,
      fecha: fila.fecha as string,
    }));

    // Retornamos el listado de gastos con codigo 200
    return res.status(200).json(gastos);
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al obtener gastos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
