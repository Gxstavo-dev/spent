import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Mapa que convierte el nombre del mes en español a su numero correspondiente (Enero -> 1, Febrero -> 2, etc.)
const meses: Record<string, number> = {
  Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
  Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
};

// Arreglo que convierte el numero del mes (1-12) a su nombre en español
const nombreMeses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// Controlador que crea o actualiza el presupuesto del mes (POST /transacciones/presupuesto)
// Parametros del cuerpo: monto (numero), mes (numero o string como "Enero")
// Si ya existe un presupuesto para el mes, lo actualiza; si no, crea uno nuevo
// Retorna: 200 con el nombre del mes y año, 400 si faltan datos, 401 si no esta autenticado
export const crearPresupuesto = async (req: Request, res: Response) => {
  // Extraemos el monto y el mes del cuerpo de la solicitud
  const { monto, mes } = req.body;

  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Identificador del usuario autenticado
  const idUsuario = usuario.id;

  // Si el mes se envio como texto (ej: "Enero"), lo convertimos a numero usando el mapa
  const numeroMes = typeof mes === "string" ? meses[mes] : mes;

  // Obtenemos el año actual
  const anio = new Date().getFullYear();

  // Validamos que ambos campos obligatorios esten presentes
  if (!monto || !numeroMes) {
    return res.status(400).json({ error: "Monto y mes son requeridos" });
  }

  try {
    // Verificamos si ya existe un presupuesto registrado para este mes y año
    const existente = await conexion.execute({
      sql: "SELECT id FROM presupuesto WHERE idUsuario = ? AND mes = ? AND anio = ? LIMIT 1",
      args: [idUsuario, numeroMes, anio],
    });

    if (existente.rows.length > 0) {
      // Si ya existe un presupuesto, actualizamos el monto
      await conexion.execute({
        sql: "UPDATE presupuesto SET monto = ? WHERE idUsuario = ? AND mes = ? AND anio = ?",
        args: [monto, idUsuario, numeroMes, anio],
      });
    } else {
      // Si no existe, insertamos un nuevo registro de presupuesto
      await conexion.execute({
        sql: "INSERT INTO presupuesto(idUsuario, monto, mes, anio) VALUES(?,?,?,?)",
        args: [idUsuario, monto, numeroMes, anio],
      });
    }

    // Convertimos el numero del mes a su nombre legible
    const nombreMes = nombreMeses[numeroMes - 1] || mes;

    // Retornamos respuesta exitosa con el mes y año del presupuesto creado o actualizado
    return res.status(200).json({ status: "ok", mes: nombreMes, anio });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al crear presupuesto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
