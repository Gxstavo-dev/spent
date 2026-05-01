import express from "express";
import {
  login,
  registrarUsuarios,
  verificarToken,
} from "../controllers/usuarios.controller";

export const rutaUsuarios = express.Router();

rutaUsuarios.post("/registro", registrarUsuarios);
rutaUsuarios.post("/login", login);
rutaUsuarios.get("/verificar", verificarToken);
