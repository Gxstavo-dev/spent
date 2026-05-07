import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Controlador que cambia el nombre del usuario autenticado (PUT /usuarios/cambiar-nombre)
// Parametros del cuerpo: nombre (string) - el nuevo nombre del usuario
// Retorna: 200 si se actualizo correctamente, 400 si el nombre esta vacio, 401 si no esta autenticado
export const cambiarNombre = async (req: Request, res: Response) => {
  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Extraemos el nuevo nombre del cuerpo de la solicitud
  const { nombre } = req.body;

  // Validamos que el nombre no este vacio o solo contenga espacios en blanco
  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ error: "El nombre es requerido" });
  }

  try {
    // Actualizamos el nombre del usuario en la base de datos
    const consulta = await conexion.execute({
      sql: "UPDATE usuarios SET nombre = ? WHERE id = ?",
      args: [nombre.trim(), usuario.id],
    });

    // Si se afecto exactamente una fila, la actualizacion fue exitosa
    if (consulta.rowsAffected === 1) {
      return res.status(200).json({ status: "ok" });
    }

    // Si no se pudo actualizar, retornamos error
    return res.status(400).json({ error: "No se pudo actualizar el nombre" });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al cambiar nombre:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
