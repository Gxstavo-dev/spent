import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Controlador que elimina un ingreso por su ID (DELETE /transacciones/ingreso/:id)
// Parametros de ruta: id (numero) - identificador del ingreso a eliminar
// Retorna: 200 si se elimino correctamente, 400 si el ID es invalido, 401 si no esta autenticado, 404 si no se encontro
export const eliminarIngreso = async (req: Request, res: Response) => {
  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Convertimos el parametro de ruta "id" a numero entero
  const id = parseInt(req.params.id as string);

  // Validamos que el ID sea un numero valido
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalido" });
  }

  try {
    // Ejecutamos la consulta SQL para eliminar el ingreso
    // Solo se elimina si el ID y el ID del usuario coinciden (pertenece al usuario autenticado)
    const consulta = await conexion.execute({
      sql: "DELETE FROM ingresos WHERE id = ? AND idUsuario = ?",
      args: [id, usuario.id],
    });

    // Si se afecto exactamente una fila, la eliminacion fue exitosa
    if (consulta.rowsAffected === 1) {
      return res.status(200).json({ status: "ok" });
    }

    // Si no se encontro el ingreso con ese ID para este usuario, retornamos 404
    return res.status(404).json({ error: "Ingreso no encontrado" });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al eliminar ingreso:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
