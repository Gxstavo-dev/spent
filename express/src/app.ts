import cors from "cors";
import express from "express";
import { rutaUsuarios } from "./routes/rutaUsuarios";
import { rutaTransacciones } from "./routes/rutaTransacciones";

// Importaciones:
// cors - middleware para permitir solicitudes de origen cruzado (Cross-Origin Resource Sharing)
// express - framework web para Node.js
// rutaUsuarios - enrutador con las rutas de autenticacion y gestion de usuarios
// rutaTransacciones - enrutador con las rutas de transacciones (ingresos, gastos, presupuesto, resumen)

// Inicializamos la aplicacion Express
const app = express();

// Configuracion global: Turso (libsql) devuelve valores BigInt que JSON no puede serializar
// Esta sobreescritura convierte automaticamente cualquier BigInt a Number al serializar a JSON
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware CORS configurado para aceptar solicitudes desde el frontend en localhost:1420
// con soporte para enviar cookies y credenciales (encabezados de autenticacion)
app.use(cors({
  origin: ["http://localhost:1420", "tauri://localhost", "https://tauri.localhost"],
  credentials: true,
}));

// Montamos las rutas de usuarios bajo el prefijo /usuarios
app.use("/usuarios", rutaUsuarios);

// Montamos las rutas de transacciones bajo el prefijo /transacciones
app.use("/transacciones", rutaTransacciones);

// Exportamos la aplicacion configurada para que index.ts la use al iniciar el servidor
export default app;
