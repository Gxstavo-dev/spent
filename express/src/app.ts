// configuracion de express
import cors from "cors";
import express from "express";
import { rutaUsuarios } from "./routes/rutaUsuarios";

const app = express(); // iniciarlizar express y almacenarlo en app

// permita json
app.use(express.json());
app.use(cors({ origin: "http://localhost:1420", credentials: true })); // para que acepte los datos que vienen de otro puerto
app.use("/usuarios", rutaUsuarios);

export default app;
