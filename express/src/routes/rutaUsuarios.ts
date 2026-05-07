import express from "express";
import { login } from "../controllers/usuario/login";
import { registrarse } from "../controllers/usuario/registro";
import { verificarToken } from "../controllers/usuario/verificacion";
import { obtenerUsuario } from "../controllers/usuario/obtenerUsuario";
import { cambiarNombre } from "../controllers/usuario/cambiarNombre";
import { cambiarContrasena } from "../controllers/usuario/cambiarContrasena";

export const rutaUsuarios = express.Router();

rutaUsuarios.post("/registro", registrarse);
rutaUsuarios.post("/login", login);
rutaUsuarios.get("/verificar", verificarToken);
rutaUsuarios.get("/mi-cuenta", obtenerUsuario);
rutaUsuarios.put("/cambiar-nombre", cambiarNombre);
rutaUsuarios.put("/cambiar-contrasena", cambiarContrasena);
