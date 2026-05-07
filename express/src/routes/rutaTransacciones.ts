import express from "express";
import { crearIngreso } from "../controllers/ingreso/crearIngreso";
import { crearGasto } from "../controllers/gasto/crearGasto";
import { crearPresupuesto } from "../controllers/presupuesto/crearPresupuesto";
import { obtenerResumen } from "../controllers/resumen/obtenerResumen";
import { eliminarDatos } from "../controllers/ajustes/eliminarDatos";

export const rutaTransacciones = express.Router();

rutaTransacciones.post("/ingreso", crearIngreso);
rutaTransacciones.post("/gasto", crearGasto);
rutaTransacciones.post("/presupuesto", crearPresupuesto);
rutaTransacciones.get("/resumen", obtenerResumen);
rutaTransacciones.delete("/datos", eliminarDatos);
