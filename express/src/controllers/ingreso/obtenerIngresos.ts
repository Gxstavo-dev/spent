import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Controlador que obtiene todos los ingresos del usuario autenticado (GET /transacciones/ingresos)
// Retorna: 200 con el listado de ingresos, 401 si no esta autenticado
export const obtenerIngresos = async (req: Request, res: Response) => {
  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    // Consultamos todos los ingresos del usuario ordenados por fecha descendente y luego por ID descendente
    const consulta = await conexion.execute({
      sql: "SELECT id, monto, descripcion, fecha FROM ingresos WHERE idUsuario = ? ORDER BY fecha DESC, id DESC",
      args: [usuario.id],
    });

    // Transformamos cada fila de la base de datos a un objeto JavaScript mas limpio
    // Convertimos los campos id y monto a numero para evitar problemas con BigInt
    const ingresos = consulta.rows.map((fila) => ({
      id: Number(fila.id),
      monto: Number(fila.monto),
      descripcion: fila.descripcion as string,
      fecha: fila.fecha as string,
    }));

    // Retornamos el listado de ingresos con codigo 200
    return res.status(200).json(ingresos);
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al obtener ingresos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
