import express from "express";
import { crearIngreso } from "../controllers/ingreso/crearIngreso";
import { obtenerIngresos } from "../controllers/ingreso/obtenerIngresos";
import { crearGasto } from "../controllers/gasto/crearGasto";
import { obtenerGastos } from "../controllers/gasto/obtenerGastos";
import { conteoGastos } from "../controllers/gasto/conteoGastos";
import { crearPresupuesto } from "../controllers/presupuesto/crearPresupuesto";
import { obtenerResumen } from "../controllers/resumen/obtenerResumen";
import { eliminarDatos } from "../controllers/ajustes/eliminarDatos";

export const rutaTransacciones = express.Router();

rutaTransacciones.post("/ingreso", crearIngreso);
rutaTransacciones.get("/ingresos", obtenerIngresos);
rutaTransacciones.post("/gasto", crearGasto);
rutaTransacciones.get("/gastos", obtenerGastos);
rutaTransacciones.get("/gastos/conteo", conteoGastos);
rutaTransacciones.post("/presupuesto", crearPresupuesto);
rutaTransacciones.get("/resumen", obtenerResumen);
rutaTransacciones.delete("/datos", eliminarDatos);
