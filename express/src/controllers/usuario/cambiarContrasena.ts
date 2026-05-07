import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";
import bcrypt from "bcryptjs";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT
// bcrypt - biblioteca para encriptar y comparar contraseñas de forma segura

// Controlador que cambia la contraseña del usuario autenticado (PUT /usuarios/cambiar-contrasena)
// Parametros del cuerpo: contrasenaActual (string), contrasenaNueva (string, minimo 6 caracteres)
// Retorna: 200 si se cambio correctamente, 400 si las contraseñas no son validas, 401 si no esta autenticado
export const cambiarContrasena = async (req: Request, res: Response) => {
  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Extraemos la contraseña actual y la nueva del cuerpo de la solicitud
  const { contrasenaActual, contrasenaNueva } = req.body;

  // Validamos que ambas contraseñas esten presentes
  if (!contrasenaActual || !contrasenaNueva) {
    return res.status(400).json({ error: "Ambas contraseñas son requeridas" });
  }

  // Validamos que la nueva contraseña tenga al menos 6 caracteres
  if (contrasenaNueva.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  try {
    // Obtenemos la contraseña actual almacenada en la base de datos
    const consulta = await conexion.execute({
      sql: "SELECT contrasena FROM usuarios WHERE id = ? LIMIT 1",
      args: [usuario.id],
    });

    // Extraemos el resultado de la consulta
    const datos = consulta.rows[0] as unknown as { contrasena: string } | undefined;

    // Si no se encontro al usuario, retornamos 404
    if (!datos) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificamos que la contraseña actual proporcionada coincida con la almacenada
    const valida = await bcrypt.compare(contrasenaActual, datos.contrasena);

    // Si la contraseña actual no es correcta, retornamos error
    if (!valida) {
      return res.status(400).json({ error: "La contraseña actual no es correcta" });
    }

    // Encriptamos la nueva contraseña con bcrypt usando 10 rondas de sal
    const hash = await bcrypt.hash(contrasenaNueva, 10);

    // Actualizamos la contraseña en la base de datos
    await conexion.execute({
      sql: "UPDATE usuarios SET contrasena = ? WHERE id = ?",
      args: [hash, usuario.id],
    });

    // Retornamos respuesta exitosa
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al cambiar contraseña:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
