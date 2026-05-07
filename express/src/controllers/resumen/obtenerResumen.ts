import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Controlador que obtiene el resumen financiero del mes actual (GET /transacciones/resumen)
// Parametros de consulta opcionales: ?categoria=Comida (filtra solo los gastos de esa categoria)
// Retorna: 200 con gastos, ingresos, presupuesto y balance del mes, 401 si no esta autenticado
export const obtenerResumen = async (req: Request, res: Response) => {
  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Identificador del usuario autenticado
  const idUsuario = usuario.id;

  // Obtenemos la fecha actual para calcular el mes y año en curso
  const ahora = new Date();
  const mesActual = ahora.getMonth() + 1; // getMonth() devuelve valores de 0 a 11, sumamos 1 para obtener 1-12
  const anioActual = ahora.getFullYear();

  // Filtro opcional de categoria desde los parametros de consulta (query string)
  const categoria = req.query.categoria as string | undefined;

  try {
    // Variable para almacenar el resultado de la consulta de gastos
    let totalGastos;

    // Si hay filtro de categoria, calculamos el total de gastos solo para esa categoria en el mes actual
    if (categoria) {
      totalGastos = await conexion.execute({
        sql: "SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE idUsuario = ? AND categoria = ? AND strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?",
        args: [idUsuario, categoria, String(mesActual).padStart(2, "0"), String(anioActual)],
      });
    } else {
      // Si no hay filtro, calculamos el total de todos los gastos del mes actual
      totalGastos = await conexion.execute({
        sql: "SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE idUsuario = ? AND strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?",
        args: [idUsuario, String(mesActual).padStart(2, "0"), String(anioActual)],
      });
    }

    // Calculamos el total de ingresos del mes actual
    const totalIngresos = await conexion.execute({
      sql: "SELECT COALESCE(SUM(monto), 0) as total FROM ingresos WHERE idUsuario = ? AND strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?",
      args: [idUsuario, String(mesActual).padStart(2, "0"), String(anioActual)],
    });

    // Obtenemos el presupuesto establecido para el mes y año actuales
    const presupuesto = await conexion.execute({
      sql: "SELECT monto FROM presupuesto WHERE idUsuario = ? AND mes = ? AND anio = ? LIMIT 1",
      args: [idUsuario, mesActual, anioActual],
    });

    // Extraemos los valores de las consultas, usando 0 como valor predeterminado si no hay datos
    const gastos =
      (totalGastos.rows[0] as unknown as { total: number } | undefined)?.total || 0;
    const ingresos =
      (totalIngresos.rows[0] as unknown as { total: number } | undefined)?.total || 0;
    const presupuestoMonto =
      (presupuesto.rows[0] as unknown as { monto: number } | undefined)?.monto || 0;

    // Retornamos el resumen financiero
    // Si hay filtro de categoria, los ingresos se muestran como 0 (no aplican al filtro)
    // El balance se calcula como ingresos - gastos (o solo gastos si hay filtro de categoria)
    return res.status(200).json({
      gastos,
      ingresos: categoria ? 0 : ingresos,
      presupuesto: presupuestoMonto,
      balance: categoria ? gastos : ingresos - gastos,
    });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al obtener resumen:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
