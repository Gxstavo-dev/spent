import type { Request, Response } from "express";
import { conexion } from "../../lib/local/Database";
import { obtenerUsuarioDeToken } from "../../lib/auth";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// conexion - conexion a la base de datos local SQLite
// obtenerUsuarioDeToken - funcion auxiliar para extraer el usuario autenticado del token JWT

// Controlador que obtiene el conteo de gastos agrupados por categoria (GET /transacciones/gastos/conteo)
// Retorna: 200 con un objeto que contiene el conteo por categoria y el total general, 401 si no esta autenticado
export const conteoGastos = async (req: Request, res: Response) => {
  // Obtenemos el usuario autenticado a partir del token
  const usuario = obtenerUsuarioDeToken(req);

  // Verificamos que el usuario este autenticado
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    // Consultamos la base de datos agrupando los gastos por categoria y contando cuantos hay en cada una
    const consulta = await conexion.execute({
      sql: "SELECT categoria, COUNT(*) as total FROM gastos WHERE idUsuario = ? GROUP BY categoria",
      args: [usuario.id],
    });

    // Objeto donde almacenaremos el conteo: clave = nombre de la categoria, valor = cantidad de gastos
    const conteo: Record<string, number> = {};

    // Variable para acumular el total general de gastos
    let total = 0;

    // Iteramos sobre cada fila del resultado de la consulta
    consulta.rows.forEach((fila: any) => {
      // Si la categoria es nula, la etiquetamos como "Sin categoria"
      const cat = (fila.categoria as string) || "Sin categoria";
      // Convertimos el total a numero
      const cantidad = Number(fila.total);
      // Almacenamos el conteo en el objeto
      conteo[cat] = cantidad;
      // Sumamos al total general
      total += cantidad;
    });

    // Retornamos el conteo por categoria y el total general
    return res.status(200).json({ conteo, total });
  } catch (error) {
    // Capturamos cualquier error en la operacion de base de datos
    console.error("Error al contar gastos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
