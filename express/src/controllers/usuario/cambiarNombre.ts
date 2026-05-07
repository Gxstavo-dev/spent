// importamos los tipos de express para poder usar Request y Response
import type { Request, Response } from "express";
// importamos la conexion a la base de datos para poder hacer consultas
import { conexion } from "../../lib/local/Database";
// importamos la funcion que obtiene el usuario desde el token
import { obtenerUsuarioDeToken } from "../../lib/auth";

// esta funcion se ejecuta cuando alguien hace un PUT a /usuarios/cambiar-nombre
export const cambiarNombre = async (req: Request, res: Response) => {
  // obtenemos el usuario actual desde el token que envio en el header
  const usuario = obtenerUsuarioDeToken(req);

  // si no hay usuario significa que el token no es valido o no envio token
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // del cuerpo de la peticion sacamos el nombre nuevo
  const { nombre } = req.body;

  // validamos que el nombre no este vacio
  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ error: "El nombre es requerido" });
  }

  try {
    // actualizamos el nombre en la base de datos
    const consulta = await conexion.execute({
      sql: "UPDATE usuarios SET nombre = ? WHERE id = ?",
      args: [nombre.trim(), usuario.id],
    });

    if (consulta.rowsAffected === 1) {
      return res.status(200).json({ status: "ok" });
    }

    return res.status(400).json({ error: "No se pudo actualizar el nombre" });
  } catch (error) {
    console.error("Error al cambiar nombre:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
