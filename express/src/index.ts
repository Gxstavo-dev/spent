// Punto de entrada principal del servidor Express
// Carga las variables de entorno y levanta el servidor HTTP

import dotenv from "dotenv";
import path from "path";

// Cargamos las variables de entorno desde el archivo .env antes que cualquier otra configuracion
dotenv.config({ path: path.join(__dirname, ".env") });

import app from "./app";

// Importaciones:
// dotenv - para cargar variables de entorno desde el archivo .env
// path - para construir rutas de archivos de manera segura
// app - la aplicacion Express configurada (rutas, middleware, etc.)

// Definimos el puerto en el que escuchara el servidor
// Si no esta definido en las variables de entorno, usamos el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor Express en el puerto especificado
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
