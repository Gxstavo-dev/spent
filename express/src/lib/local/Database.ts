import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

class Db {
  // aqui guardamos la unica conexion a la base de datos que vamos a usar en toda la app
  private static instancia: Database;

  // el constructor es privado porque no queremos que alguien haga "new Db()"
  // queremos que usen "Db.obtenerInstancia()" en su lugar
  private constructor() {}

  // este metodo nos da la conexion a la base de datos
  // si no existe la crea, si ya existe la devuelve
  static obtenerInstancia(): Database {
    if (!Db.instancia) {
      // aqui armamos la ruta donde se guardara el archivo de la base de datos
      // __dirname es la carpeta donde esta este archivo, y alli creamos spentLocal.db
      const rutaDb = path.join(__dirname, "spentLocal.db");
      Db.instancia = new Database(rutaDb);
      // aqui leemos el archivo schema.sql y creamos las tablas en la base de datos
      Db.schema();
    }
    return Db.instancia;
  }

  // este metodo lee el archivo schemas.sql y lo ejecuta para crear las tablas
  private static schema(): void {
    // ruta del archivo schemas.sql que esta una carpeta arriba de local/
    const rutaSchema = path.join(__dirname, "../Schemas/schemas.sql");
    // leemos el archivo como texto
    const schema = fs.readFileSync(rutaSchema, "utf-8");
    // ejecutamos el sql en la base de datos
    Db.instancia.exec(schema);
  }
}

// exportamos la conexion ya lista para usar en cualquier parte del proyecto
export const conexion = Db.obtenerInstancia();
