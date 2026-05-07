// importamos los tipos de express para poder usar Request y Response
import type { Request, Response } from "express";
// importamos la conexion a la base de datos para poder hacer consultas
import { conexion } from "../../lib/local/Database";
// importamos la funcion que obtiene el usuario desde el token
import { obtenerUsuarioDeToken } from "../../lib/auth";

// esta funcion se ejecuta cuando alguien hace un GET a /transacciones/resumen
export const obtenerResumen = async (req: Request, res: Response) => {
  // obtenemos el usuario actual desde el token que envio en el header
  const usuario = obtenerUsuarioDeToken(req);

  // si no hay usuario significa que el token no es valido o no envio token
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // guardamos el id del usuario para usarlo en las consultas
  const idUsuario = usuario.id;

  // obtenemos la fecha actual para saber que mes y año estamos consultando
  const ahora = new Date();
  const mesActual = ahora.getMonth() + 1; // getMonth empieza en 0, por eso sumamos 1
  const anioActual = ahora.getFullYear();

  // intentamos hacer las consultas a la base de datos
  try {
    // consultamos el total de gastos del mes actual para este usuario
    // usamos strftime para extraer el mes y año de la columna fecha
    const totalGastos = await conexion.execute({
      sql: "SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE idUsuario = ? AND strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?",
      // padStart es para que el mes siempre tenga 2 digitos (01, 02, etc.)
      args: [idUsuario, String(mesActual).padStart(2, "0"), String(anioActual)],
    });

    // consultamos el total de ingresos del mes actual para este usuario
    const totalIngresos = await conexion.execute({
      sql: "SELECT COALESCE(SUM(monto), 0) as total FROM ingresos WHERE idUsuario = ? AND strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?",
      args: [idUsuario, String(mesActual).padStart(2, "0"), String(anioActual)],
    });

    // consultamos el presupuesto configurado para este mes y año
    const presupuesto = await conexion.execute({
      sql: "SELECT monto FROM presupuesto WHERE idUsuario = ? AND mes = ? AND anio = ? LIMIT 1",
      args: [idUsuario, mesActual, anioActual],
    });

    // extraemos los valores de las consultas, si no hay datos usamos 0
    // usamos "as unknown as" porque el tipo Row no coincide exactamente
    const gastos =
      (totalGastos.rows[0] as unknown as { total: number } | undefined)?.total || 0;
    const ingresos =
      (totalIngresos.rows[0] as unknown as { total: number } | undefined)?.total || 0;
    const presupuestoMonto =
      (presupuesto.rows[0] as unknown as { monto: number } | undefined)?.monto || 0;

    // devolvemos los datos al frontend
    // balance es lo que sobra: ingresos - gastos
    return res.status(200).json({
      gastos,
      ingresos,
      presupuesto: presupuestoMonto,
      balance: ingresos - gastos,
    });
  } catch (error) {
    // si algo sale mal lo mostramos en consola y devolvemos error 500
    console.error("Error al obtener resumen:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
