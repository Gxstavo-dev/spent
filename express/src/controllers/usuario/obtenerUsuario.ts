import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";
import type { Usuarios } from "../../types/usuarios";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT
// Usuarios - tipo TypeScript que define la estructura de un usuario

// Controlador que obtiene los datos del perfil del usuario autenticado (GET /usuarios/mi-cuenta)
// Retorna: 200 con id, email, nombre y fecha de creacion del usuario, 401 si no esta autenticado, 404 si no se encuentra
export const obtenerUsuario = async (req: Request, res: Response) => {
  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    // Consultamos los datos del usuario en la base de datos (excluimos la contraseña por seguridad)
    const consulta = await conexion.execute({
      sql: "SELECT id, email, nombre, fechadeCreacion FROM usuarios WHERE id = ? LIMIT 1",
      args: [usuario.id],
    });

    // Obtenemos la primera fila del resultado
    const datos = consulta.rows[0] as Usuarios | undefined;

    // Si no se encontro al usuario en la base de datos, retornamos 404
    if (!datos) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Retornamos los datos del usuario (sin la contraseña)
    return res.status(200).json({
      id: datos.id,
      email: datos.email,
      nombre: datos.nombre,
      fechadeCreacion: datos.fechadeCreacion,
    });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
