// importamos los tipos de express para poder usar Request y Response
import type { Request, Response } from "express";
// importamos la conexion a la base de datos para poder hacer consultas
import { conexion } from "../../lib/local/Database";
// importamos la funcion que obtiene el usuario desde el token
import { obtenerUsuarioDeToken } from "../../lib/auth";

// esto es para convertir el nombre del mes en español a numero
// ejemplo: "Enero" -> 1, "Febrero" -> 2, etc.
const meses: Record<string, number> = {
  Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
  Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
};

// esto es para convertir el numero de mes a nombre en español
// lo usamos para devolver el nombre bonito al frontend
const nombreMeses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// esta funcion se ejecuta cuando alguien hace un POST a /transacciones/presupuesto
export const crearPresupuesto = async (req: Request, res: Response) => {
  // del cuerpo de la peticion sacamos el monto y el mes
  const { monto, mes } = req.body;
  // obtenemos el usuario actual desde el token que envio en el header
  const usuario = obtenerUsuarioDeToken(req);

  // si no hay usuario significa que el token no es valido o no envio token
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // guardamos el id del usuario para usarlo en la consulta
  const idUsuario = usuario.id;

  // si el mes viene como texto (Ej: "Enero") lo convertimos a numero
  const numeroMes = typeof mes === "string" ? meses[mes] : mes;
  // obtenemos el año actual para guardarlo en la base de datos
  const anio = new Date().getFullYear();

  // validamos que el monto y el mes existan
  if (!monto || !numeroMes) {
    return res.status(400).json({ error: "Monto y mes son requeridos" });
  }

  // intentamos hacer la insercion o actualizacion en la base de datos
  try {
    // primero verificamos si ya existe un presupuesto para ese mes y año
    const existente = await conexion.execute({
      sql: "SELECT id FROM presupuesto WHERE idUsuario = ? AND mes = ? AND anio = ? LIMIT 1",
      args: [idUsuario, numeroMes, anio],
    });

    // si ya existe, actualizamos el monto en lugar de crear uno nuevo
    if (existente.rows.length > 0) {
      await conexion.execute({
        sql: "UPDATE presupuesto SET monto = ? WHERE idUsuario = ? AND mes = ? AND anio = ?",
        args: [monto, idUsuario, numeroMes, anio],
      });
    } else {
      // si no existe, insertamos uno nuevo
      await conexion.execute({
        sql: "INSERT INTO presupuesto(idUsuario, monto, mes, anio) VALUES(?,?,?,?)",
        args: [idUsuario, monto, numeroMes, anio],
      });
    }

    // convertimos el numero de mes a nombre para devolverlo al frontend
    const nombreMes = nombreMeses[numeroMes - 1] || mes;
    // devolvemos respuesta exitosa
    return res.status(200).json({ status: "ok", mes: nombreMes, anio });
  } catch (error) {
    // si algo sale mal lo mostramos en consola y devolvemos error 500
    console.error("Error al crear presupuesto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
