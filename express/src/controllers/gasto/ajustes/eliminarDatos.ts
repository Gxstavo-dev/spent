import type { Request, Response } from "express";
import { conexion } from "../../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Controlador que elimina todos los datos financieros del usuario autenticado (DELETE /transacciones/datos)
// Elimina gastos, ingresos y presupuestos asociados al usuario (NO elimina la cuenta de usuario)
// Retorna: 200 si se eliminaron correctamente, 401 si no esta autenticado
export const eliminarDatos = async (req: Request, res: Response) => {
  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Identificador del usuario autenticado
  const idUsuario = usuario.id;

  try {
    // Eliminamos todos los gastos asociados al usuario
    await conexion.execute({
      sql: "DELETE FROM gastos WHERE idUsuario = ?",
      args: [idUsuario],
    });

    // Eliminamos todos los ingresos asociados al usuario
    await conexion.execute({
      sql: "DELETE FROM ingresos WHERE idUsuario = ?",
      args: [idUsuario],
    });

    // Eliminamos todos los presupuestos asociados al usuario
    await conexion.execute({
      sql: "DELETE FROM presupuesto WHERE idUsuario = ?",
      args: [idUsuario],
    });

    // Retornamos respuesta exitosa
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al eliminar datos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
