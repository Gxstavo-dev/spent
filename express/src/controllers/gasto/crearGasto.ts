import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Controlador que maneja la creacion de un nuevo gasto (POST /transacciones/gasto)
// Parametros del cuerpo (req.body): monto (numero), descripcion (string opcional), categoria (string opcional), fecha (string)
// Retorna: 201 con el ID del gasto creado, 400 si faltan datos, 401 si no esta autenticado
export const crearGasto = async (req: Request, res: Response) => {
  // Extraemos los campos del cuerpo de la solicitud
  const { monto, descripcion, categoria, fecha } = req.body;

  // Obtenemos el usuario autenticado a partir del token en el encabezado
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Extraemos el identificador del usuario autenticado
  const idUsuario = usuario.id;

  // Validamos que los campos obligatorios esten presentes
  if (!monto || !fecha) {
    return res.status(400).json({ error: "Monto y fecha son requeridos" });
  }

  try {
    // Ejecutamos la consulta SQL para insertar el gasto en la base de datos
    // Usamos parametros args para evitar inyeccion SQL
    const consulta = await conexion.execute({
      sql: "INSERT INTO gastos(monto, descripcion, categoria, fecha, idUsuario) VALUES(?,?,?,?,?)",
      args: [monto, descripcion || null, categoria || null, fecha, idUsuario],
    });

    // Si la insercion afecto exactamente una fila, el gasto se creo correctamente
    if (consulta.rowsAffected === 1) {
      return res.status(201).json({
        status: "ok",
        id: consulta.lastInsertRowid,
      });
    }

    // Si no se afecto ninguna fila, retornamos un error
    return res.status(400).json({ error: "No se pudo crear el gasto" });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al crear gasto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
