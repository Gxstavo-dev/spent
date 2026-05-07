import express from "express";
import { crearIngreso } from "../controllers/ingreso/crearIngreso";
import { obtenerIngresos } from "../controllers/ingreso/obtenerIngresos";
import { actualizarIngreso } from "../controllers/ingreso/actualizarIngreso";
import { eliminarIngreso } from "../controllers/ingreso/eliminarIngreso";
import { crearGasto } from "../controllers/gasto/crearGasto";
import { obtenerGastos } from "../controllers/gasto/obtenerGastos";
import { actualizarGasto } from "../controllers/gasto/actualizarGasto";
import { eliminarGasto } from "../controllers/gasto/eliminarGasto";
import { conteoGastos } from "../controllers/gasto/conteoGastos";
import { crearPresupuesto } from "../controllers/presupuesto/crearPresupuesto";
import { obtenerResumen } from "../controllers/resumen/obtenerResumen";
import { eliminarDatos } from "../controllers/ajustes/eliminarDatos";

// Importaciones de los controladores de transacciones:
// Ingresos: crearIngreso, obtenerIngresos, actualizarIngreso, eliminarIngreso
// Gastos: crearGasto, obtenerGastos, actualizarGasto, eliminarGasto, conteoGastos
// Presupuesto: crearPresupuesto
// Resumen: obtenerResumen
// Ajustes: eliminarDatos

// Exportamos un enrutador de Express con todas las rutas relacionadas
// con transacciones (ingresos, gastos, presupuesto, resumen y ajustes)
export const rutaTransacciones = express.Router();

// Rutas para ingresos
rutaTransacciones.post("/ingreso", crearIngreso);        // Crea un nuevo ingreso
rutaTransacciones.get("/ingresos", obtenerIngresos);      // Obtiene todos los ingresos del usuario
rutaTransacciones.put("/ingreso/:id", actualizarIngreso); // Actualiza un ingreso existente por su ID
rutaTransacciones.delete("/ingreso/:id", eliminarIngreso);// Elimina un ingreso por su ID

// Rutas para gastos
rutaTransacciones.post("/gasto", crearGasto);             // Crea un nuevo gasto
rutaTransacciones.get("/gastos", obtenerGastos);           // Obtiene todos los gastos del usuario (con filtro opcional por categoria)
rutaTransacciones.put("/gasto/:id", actualizarGasto);     // Actualiza un gasto existente por su ID
rutaTransacciones.delete("/gasto/:id", eliminarGasto);    // Elimina un gasto por su ID
rutaTransacciones.get("/gastos/conteo", conteoGastos);    // Obtiene el conteo de gastos agrupados por categoria

// Rutas para presupuesto
rutaTransacciones.post("/presupuesto", crearPresupuesto); // Crea o actualiza el presupuesto del mes

// Ruta para resumen financiero
rutaTransacciones.get("/resumen", obtenerResumen);        // Obtiene el resumen del mes (gastos, ingresos, presupuesto y balance)

// Ruta para ajustes
rutaTransacciones.delete("/datos", eliminarDatos);        // Elimina todos los datos del usuario
