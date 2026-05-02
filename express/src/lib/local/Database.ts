// Importamos el cliente de libsql para conectarnos a la base de datos
import { createClient } from "@libsql/client";
// Importamos path para armar rutas de archivos
import path from "path";
// Importamos fs para leer archivos del sistema
import fs from "fs";

// Ruta donde se guardara el archivo de la base de datos
const rutaDb = path.join(__dirname, "spentLocal.db");
// Ruta donde esta el archivo SQL con las tablas
const rutaSchema = path.join(__dirname, "../Schemas/schemas.sql");

// Creamos la conexion a la base de datos local (archivo .db)
// Usamos file: para indicar que es una base de datos local, no en la nube
export const conexion = createClient({
  url: `file:${rutaDb}`,
});

// Intentamos crear las tablas si no existen
// Esto lee el archivo schemas.sql y ejecuta todo el codigo SQL
try {
  // Leemos el archivo de esquema como texto
  const schema = fs.readFileSync(rutaSchema, "utf-8");
  // Ejecutamos todo el SQL (CREATE TABLE IF NOT EXISTS)
  conexion.executeMultiple(schema);
} catch (error) {
  // Si hay un error (como que no exista el archivo), lo mostramos en consola
  console.error("Error al ejecutar schema:", error);
}
