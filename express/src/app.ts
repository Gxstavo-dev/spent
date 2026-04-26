// configuracion de express
import express from "express";
import { rutaUsuarios } from "./routes/rutaUsuarios";

const app = express(); // iniciarlizar express y almacenarlo en app

// permita json
app.use(express.json());
app.use("/usuarios", rutaUsuarios);

export default app;
