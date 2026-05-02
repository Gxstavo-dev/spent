import express from "express";
import { login } from "../controllers/usuario/login";
import { registrarse } from "../controllers/usuario/registro";
import { verificarToken } from "../controllers/usuario/verificacion";

export const rutaUsuarios = express.Router();

rutaUsuarios.post("/registro", registrarse);
rutaUsuarios.post("/login", login);
rutaUsuarios.get("/verificar", verificarToken);
