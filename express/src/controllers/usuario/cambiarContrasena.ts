// importamos los tipos de express para poder usar Request y Response
import type { Request, Response } from "express";
// importamos la conexion a la base de datos para poder hacer consultas
import { conexion } from "../../lib/local/Database";
// importamos la funcion que obtiene el usuario desde el token
import { obtenerUsuarioDeToken } from "../../lib/auth";
// importamos bcrypt para encriptar la nueva contraseña
import bcrypt from "bcryptjs";

// esta funcion se ejecuta cuando alguien hace un PUT a /usuarios/cambiar-contrasena
export const cambiarContrasena = async (req: Request, res: Response) => {
  // obtenemos el usuario actual desde el token que envio en el header
  const usuario = obtenerUsuarioDeToken(req);

  // si no hay usuario significa que el token no es valido o no envio token
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // del cuerpo de la peticion sacamos la contraseña actual y la nueva
  const { contrasenaActual, contrasenaNueva } = req.body;

  // validamos que ambos campos existan
  if (!contrasenaActual || !contrasenaNueva) {
    return res.status(400).json({ error: "Ambas contraseñas son requeridas" });
  }

  // validamos que la nueva contraseña no sea muy corta
  if (contrasenaNueva.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  try {
    // primero obtenemos la contraseña actual del usuario
    const consulta = await conexion.execute({
      sql: "SELECT contrasena FROM usuarios WHERE id = ? LIMIT 1",
      args: [usuario.id],
    });

    const datos = consulta.rows[0] as unknown as { contrasena: string } | undefined;

    if (!datos) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // verificamos que la contraseña actual sea correcta
    const valida = await bcrypt.compare(contrasenaActual, datos.contrasena);

    if (!valida) {
      return res.status(400).json({ error: "La contraseña actual no es correcta" });
    }

    // encriptamos la nueva contraseña
    const hash = await bcrypt.hash(contrasenaNueva, 10);

    // actualizamos la contraseña en la base de datos
    await conexion.execute({
      sql: "UPDATE usuarios SET contrasena = ? WHERE id = ?",
      args: [hash, usuario.id],
    });

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
