import express from "express";
import { login } from "../controllers/usuario/login";
import { registrarse } from "../controllers/usuario/registro";
import { verificarToken } from "../controllers/usuario/verificacion";
import { obtenerUsuario } from "../controllers/usuario/obtenerUsuario";
import { cambiarNombre } from "../controllers/usuario/cambiarNombre";
import { cambiarContrasena } from "../controllers/usuario/cambiarContrasena";

// Importaciones de los controladores de autenticacion y gestion de usuarios:
// login, registrarse, verificarToken, obtenerUsuario, cambiarNombre, cambiarContrasena

// Exportamos un enrutador de Express con todas las rutas relacionadas con usuarios
export const rutaUsuarios = express.Router();

// Ruta para registrar un nuevo usuario
rutaUsuarios.post("/registro", registrarse);
// Ruta para iniciar sesion y obtener un token JWT
rutaUsuarios.post("/login", login);
// Ruta para verificar si el token JWT del usuario sigue siendo valido
rutaUsuarios.get("/verificar", verificarToken);
// Ruta para obtener los datos de la cuenta del usuario autenticado
rutaUsuarios.get("/mi-cuenta", obtenerUsuario);
// Ruta para cambiar el nombre del usuario autenticado
rutaUsuarios.put("/cambiar-nombre", cambiarNombre);
// Ruta para cambiar la contraseña del usuario autenticado
rutaUsuarios.put("/cambiar-contrasena", cambiarContrasena);
