// Configuracion de la conexion a la base de datos local usando libsql (SQLite)
import { createClient } from "@libsql/client";
import path from "path";
import fs from "fs";

// Importaciones:
// createClient - funcion del cliente libsql para crear la conexion a la base de datos
// path - modulo de Node para manejar rutas de archivos
// fs - modulo de Node para leer archivos del sistema de archivos

// Ruta donde se almacenara el archivo fisico de la base de datos SQLite
const rutaDb = path.join(__dirname, "spentLocal.db");

// Ruta del archivo SQL que contiene la definicion de las tablas (esquema)
const rutaSchema = path.join(__dirname, "../Schemas/schemas.sql");

// Creamos y exportamos la conexion a la base de datos local como un archivo .db
export const conexion = createClient({
  url: `file:${rutaDb}`,
});

// Bloque try-catch para inicializar las tablas de la base de datos
// si es que aun no existen (ejecutamos el esquema SQL al iniciar)
try {
  // Leemos el contenido del archivo de esquema SQL
  const schema = fs.readFileSync(rutaSchema, "utf-8");

  // Ejecutamos todas las sentencias SQL del esquema para crear las tablas si no existen
  conexion.executeMultiple(schema);
} catch (error) {
  // Capturamos y mostramos cualquier error durante la inicializacion del esquema
  console.error("Error al ejecutar schema:", error);
}
