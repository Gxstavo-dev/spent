import { conexion } from "../../lib/local/Database";
import bcrypt from "bcryptjs";
import type { Usuarios } from "../../types/usuarios";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Importaciones:
// conexion - conexion a la base de datos local SQLite
// bcrypt - biblioteca para comparar contraseñas encriptadas
// Usuarios - tipo TypeScript que define la estructura de un usuario
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// jwt, JwtPayload - para crear y firmar tokens JWT

// Controlador que inicia sesion y genera un token JWT (POST /usuarios/login)
// Parametros del cuerpo: email (string), contrasena (string)
// Retorna: 200 con el token JWT si las credenciales son validas, 401 si las credenciales son incorrectas
export const login = async (req: Request, res: Response) => {
  // Extraemos las credenciales del cuerpo de la solicitud
  const { email, contrasena } = req.body;

  // Funcion interna que busca un usuario por su correo electronico en la base de datos
  const obtenerUsuario = async (email: string) => {
    const consulta = await conexion.execute({
      sql: "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
      args: [email],
    });
    return consulta.rows[0] as Usuarios;
  };

  // Buscamos el usuario en la base de datos
  const usuario = await obtenerUsuario(email);

  // Verificamos si el usuario existe
  if (!usuario) {
    return res.status(401).json({ error: "Credenciales incorrectas " });
  }

  // Verificamos si el usuario tiene una contraseña almacenada
  if (!usuario.contrasena) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // Comparamos la contraseña proporcionada con la almacenada (encriptada) en la base de datos
  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

  // Si la contraseña no coincide, retornamos error de autenticacion
  if (!contrasenaValida) {
    return res.status(401).json({ error: "Contraseña incorrectas" });
  }

  // Creamos un token JWT con los datos del usuario, con una validez de 24 horas
  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  );

  // Retornamos el token al cliente para que lo use en solicitudes posteriores
  return res.status(200).json({ token });
};
