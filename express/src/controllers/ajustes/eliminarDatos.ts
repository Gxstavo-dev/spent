// importamos los tipos de express para poder usar Request y Response
import type { Request, Response } from "express";
// importamos la conexion a la base de datos para poder hacer consultas
import { conexion } from "../../lib/local/Database";
// importamos la funcion que obtiene el usuario desde el token
import { obtenerUsuarioDeToken } from "../../lib/auth";

// esta funcion se ejecuta cuando alguien hace un DELETE a /transacciones/datos
export const eliminarDatos = async (req: Request, res: Response) => {
  // obtenemos el usuario actual desde el token que envio en el header
  const usuario = obtenerUsuarioDeToken(req);

  // si no hay usuario significa que el token no es valido o no envio token
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // guardamos el id del usuario para usarlo en las consultas
  const idUsuario = usuario.id;

  // intentamos eliminar todos los datos del usuario
  try {
    // primero eliminamos las notas del usuario
    await conexion.execute({
      sql: "DELETE FROM notas WHERE idUsuario = ?",
      args: [idUsuario],
    });
    // luego eliminamos los gastos del usuario
    await conexion.execute({
      sql: "DELETE FROM gastos WHERE idUsuario = ?",
      args: [idUsuario],
    });
    // luego eliminamos los ingresos del usuario
    await conexion.execute({
      sql: "DELETE FROM ingresos WHERE idUsuario = ?",
      args: [idUsuario],
    });
    // por ultimo eliminamos los presupuestos del usuario
    await conexion.execute({
      sql: "DELETE FROM presupuesto WHERE idUsuario = ?",
      args: [idUsuario],
    });

    // devolvemos respuesta exitosa
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    // si algo sale mal lo mostramos en consola y devolvemos error 500
    console.error("Error al eliminar datos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
