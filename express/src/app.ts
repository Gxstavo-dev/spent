// configuracion de express
import express from "express";

const app = express(); // iniciarlizar express y almacenarlo en app

// permita json
app.use(express.json());

export default app;
