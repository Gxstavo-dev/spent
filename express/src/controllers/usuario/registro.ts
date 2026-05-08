import { conexion } from "../../lib/local/Database";
import bcrypt from "bcryptjs";
import type { Usuarios } from "../../types/usuarios";
import type { Request, Response } from "express";

// Importaciones:
// conexion - conexion a la base de datos local SQLite
// bcrypt - biblioteca para encriptar contraseñas de forma segura
// Usuarios - tipo TypeScript que define la estructura de un usuario
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// jwt, JwtPayload - para la creacion de tokens JWT (aunque no se usa en el registro actualmente)

// Controlador que registra un nuevo usuario (POST /usuarios/registro)
// Parametros del cuerpo: email (string), nombre (string), contrasena (string)
// Retorna: 201 con el ID del usuario creado, 400 si el email ya existe o hay error, 500 si hay error interno
export const registrarse = async (req: Request, res: Response) => {
  // Extraemos los datos del usuario desde el cuerpo de la solicitud
  const { email, nombre, contrasena } = req.body;

  // Funcion interna que verifica si ya existe un usuario con el correo electronico proporcionado
  const existente = async (email: string) => {
    const consulta = await conexion.execute({
      sql: "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
      args: [email],
    });
    return consulta.rows[0] as Usuarios | undefined;
  };

  // Verificamos si el correo electronico ya esta registrado
  const usuario = await existente(email);

  if (usuario) {
    return res.status(400).json({ error: "El email ya existe" });
  }

  // Encriptamos la contraseña con bcrypt usando 10 rondas de sal para mayor seguridad
  const hashpass = await bcrypt.hash(contrasena, 10);

  // Insertamos el nuevo usuario en la base de datos
  const consulta = await conexion.execute({
    sql: "INSERT INTO usuarios(email,nombre,contrasena) VALUES(?,?,?)",
    args: [email, nombre, hashpass],
  });

  // Verificamos si la insercion fue exitosa (debe afectar exactamente una fila)
  if (consulta.rowsAffected == 1) {
    return res.status(201).json({ status: "ok", id: consulta.lastInsertRowid });
  } else {
    return res
      .status(400)
      .json({ error: "No se pudo crear el usuario con exito" });
  }
};
