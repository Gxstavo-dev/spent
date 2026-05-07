import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Controlador que actualiza un gasto existente por su ID (PUT /transacciones/gasto/:id)
// Parametros de ruta: id (numero) - identificador del gasto a actualizar
// Parametros del cuerpo: monto (numero), descripcion (string opcional), categoria (string opcional), fecha (string)
// Retorna: 200 si se actualizo correctamente, 400 si el ID es invalido, 401 si no esta autenticado, 404 si no se encontro
export const actualizarGasto = async (req: Request, res: Response) => {
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

  // Extraemos los campos actualizados del cuerpo de la solicitud
  const { monto, descripcion, categoria, fecha } = req.body;

  try {
    // Ejecutamos la consulta SQL para actualizar el gasto
    // Solo se actualiza si el ID y el ID del usuario coinciden (pertenece al usuario autenticado)
    const consulta = await conexion.execute({
      sql: "UPDATE gastos SET monto = ?, descripcion = ?, categoria = ?, fecha = ? WHERE id = ? AND idUsuario = ?",
      args: [
        monto,
        descripcion || null,
        categoria || null,
        fecha,
        id,
        usuario.id,
      ],
    });

    // Si se afecto exactamente una fila, la actualizacion fue exitosa
    if (consulta.rowsAffected === 1) {
      return res.status(200).json({ status: "ok" });
    }

    // Si no se encontro el gasto con ese ID para este usuario, retornamos 404
    return res.status(404).json({ error: "Gasto no encontrado" });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al actualizar gasto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
