import { conexion } from "../../lib/local/Database"; // importa la conexion a db para no tener que instanciarla
import bcrypt from "bcryptjs"; // para encriptar las contrasñeas y no esten en texto plano
import type { Usuarios } from "../../types/usuarios"; // el tipado de los datos de usuarios
import type { Request, Response } from "express"; // para usar response y request
import jwt, { type JwtPayload } from "jsonwebtoken";

// manejar la respuesta y peticion del server
export const registrarse = async (req: Request, res: Response) => {
  const { email, nombre, contrasena } = req.body; // obtener el contenido de los inputs enviados por form
  console.log("datos desde backend", email, nombre, contrasena);

  // funcion para verificar si existe el usuario usando el tipado de usuarios
  const existente = async (email: string) => {
    const consulta = await conexion.execute({
      sql: "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
      args: [email],
    });
    // lo tomamos como tipo usuarios y si no encuentra nada indefnido y retornamos todos los datos del usuario si existe
    return consulta.rows[0] as Usuarios | undefined;
  };

  // verificamos si existe
  const usuario = await existente(email);

  if (usuario) {
    return res.status(400).json({ error: "El email ya existe" });
  }

  // para no meter la contraseña de manera de texto plnao
  const hashpass = await bcrypt.hash(contrasena, 10); // 10 -> numero de veces que encriptara la contraseña

  const consulta = await conexion.execute({
    sql: "INSERT INTO usuarios(email,nombre,contrasena) VALUES(?,?,?)",
    args: [email, nombre, hashpass],
  });

  // si se registro enviamos un status ok y el id
  if (consulta.rowsAffected == 1) {
    return res
      .status(201) // objeto creado
      .json({ status: "ok", id: consulta.lastInsertRowid });
  } else {
    return res
      .status(400)
      .json({ error: "No se pudo crear el usuario con exito" });
  }
};
