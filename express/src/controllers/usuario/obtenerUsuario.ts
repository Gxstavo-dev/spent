// importamos los tipos de express para poder usar Request y Response
import type { Request, Response } from "express";
// importamos la conexion a la base de datos para poder hacer consultas
import { conexion } from "../../lib/local/Database";
// importamos la funcion que obtiene el usuario desde el token
import { obtenerUsuarioDeToken } from "../../lib/auth";
// importamos el tipado de usuarios
import type { Usuarios } from "../../types/usuarios";

// esta funcion se ejecuta cuando alguien hace un GET a /usuarios/mi-cuenta
export const obtenerUsuario = async (req: Request, res: Response) => {
  // obtenemos el usuario actual desde el token que envio en el header
  const usuario = obtenerUsuarioDeToken(req);

  // si no hay usuario significa que el token no es valido o no envio token
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    // buscamos al usuario en la base de datos por su id
    const consulta = await conexion.execute({
      sql: "SELECT id, email, nombre, fechadeCreacion FROM usuarios WHERE id = ? LIMIT 1",
      args: [usuario.id],
    });

    const datos = consulta.rows[0] as Usuarios | undefined;

    if (!datos) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // devolvemos los datos del usuario
    return res.status(200).json({
      id: datos.id,
      email: datos.email,
      nombre: datos.nombre,
      fechadeCreacion: datos.fechadeCreacion,
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
