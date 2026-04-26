import { conexion } from "../lib/local/Database"; // importa la conexion a db para no tener que instanciarla
import bcrypt from "bcryptjs"; // para encriptar las contrasñeas y no esten en texto plano
import type { Usuarios } from "../types/usuarios"; // el tipado de los datos de usuarios
import type { Request, Response } from "express"; // para usar response y request
import jwt from "jsonwebtoken";

// manear la respuesta y peticion del server
export const registrarUsuarios = async (req: Request, res: Response) => {
  const { email, nombre, contrasena } = req.body; // obtener el contenido de los inputs enviados por form

  // funcion para verificar si existe el usuario usando el tipado de usuarios
  const existente = (email: string) => {
    // la primera coincidencia que encuentre lo tomamos
    const consulta = conexion.prepare(
      "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
    );
    // obtenemos el email
    const resultado = consulta.get(email) as Usuarios | undefined; // lo tomamos como tipo usuarios y si no encuentra nada indefnido
    return resultado; // retornamos todos los datos del usuario si existe
  };

  // verificar si existe
  const usuario = existente(email);

  if (usuario) {
    return res.status(400).json({ error: "El email ya existe" });
  }
  // para no meter la contraseña de manera de texto plnao
  const hashpass = await bcrypt.hash(contrasena, 10); // 10 -> numero de veces que encriptara la contraseña

  const consulta = conexion.prepare(
    "INSERT INTO usuarios(email,nombre,contrasena) VALUES(?,?,?)",
  );
  const resultado = consulta.run(email, nombre, hashpass);
  if (resultado.changes == 1) {
    return res
      .status(201) // objeto creado
      .json({ status: "ok", id: resultado.lastInsertRowid });
  } else {
    return res
      .status(400)
      .json({ error: "No se pudo crear el usuario con exito" });
  }
};

// funcion para iniciar sesion
export const login = async (req: Request, res: Response) => {
  const { email, contrasena } = req.body; // obtener el contenido de los inputs enviados por form

  // funcion para obtneer los datos del usuario
  const obtenerUsuario = (email: string) => {
    // la primera coincidencia que encuentre lo tomamos
    const consulta = conexion.prepare(
      "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
    );
    // obtenemos el email
    const resultado = consulta.get(email) as Usuarios | undefined; // lo tomamos como tipo usuarios y si no encuentra nada indefnido
    return resultado; // retornamos todos los datos del usuario si existe
  };

  // para obtener todos los datos del usuario
  const usuario = obtenerUsuario(email);

  if (!usuario) {
    // 401 -> credneciales invalidas
    return res.status(401).json({ error: "Credenciales incorrectas " });
  }

  // si la contraseña es undefined retornamos error
  if (!usuario.contrasena) {
    // 401 -> credneciales invalidas
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // comprobar la contraseñas
  const contraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena);

  // si la contraseña es incorrecta retornamos el error
  if (!contraseñaValida)
    return res.status(401).json({ error: "Contraseña incorrecta" });

  // crear token para enviar los datos de manera segura al usuario
  const token = jwt.sign(
    {
      // dentro del token guardamos el id y email estos de codifican
      id: usuario.id,
      email: usuario.email,
    },
    // firma que esta en .env
    process.env.JWTCLAVE!,
    { expiresIn: "24h" }, // expira en 24 horas este token
  );
  // retornar el token
  return res.status(200).json({ token });
};
