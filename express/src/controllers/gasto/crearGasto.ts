// importamos los tipos de express para poder usar Request y Response
import type { Request, Response } from "express";
// importamos la conexion a la base de datos para poder hacer consultas
import { conexion } from "../../lib/local/Database";
// importamos la funcion que obtiene el usuario desde el token
import { obtenerUsuarioDeToken } from "../../lib/auth";

// esta funcion se ejecuta cuando alguien hace un POST a /transacciones/gasto
export const crearGasto = async (req: Request, res: Response) => {
  // del cuerpo de la peticion sacamos el monto, la descripcion, la categoria y la fecha
  const { monto, descripcion, categoria, fecha } = req.body;
  // obtenemos el usuario actual desde el token que envio en el header
  const usuario = obtenerUsuarioDeToken(req);

  // si no hay usuario significa que el token no es valido o no envio token
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // guardamos el id del usuario para usarlo en la consulta
  const idUsuario = usuario.id;

  // validamos que el monto y la fecha si existan, si no mandamos error
  if (!monto || !fecha) {
    return res.status(400).json({ error: "Monto y fecha son requeridos" });
  }

  // intentamos hacer la insercion en la base de datos
  try {
    // ejecutamos la consulta SQL para insertar un nuevo gasto
    const consulta = await conexion.execute({
      sql: "INSERT INTO gastos(monto, descripcion, categoria, fecha, idUsuario) VALUES(?,?,?,?,?)",
      // usamos ? para evitar inyeccion SQL, los valores van en args
      args: [monto, descripcion || null, categoria || null, fecha, idUsuario],
    });

    // si se inserto correctamente (rowsAffected == 1) devolvemos el id creado
    if (consulta.rowsAffected === 1) {
      return res.status(201).json({
        status: "ok",
        id: consulta.lastInsertRowid,
      });
    }

    // si no se pudo insertar mandamos un error 400
    return res.status(400).json({ error: "No se pudo crear el gasto" });
  } catch (error) {
    // si algo sale mal lo mostramos en consola y devolvemos error 500
    console.error("Error al crear gasto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
