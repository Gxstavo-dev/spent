import { conexion } from "../../lib/local/Database";
import bcrypt from "bcryptjs"; // para encriptar las contrasñeas y no esten en texto plano
import type { Usuarios } from "../../types/usuarios"; // el tipado de los datos de usuarios
import type { Request, Response } from "express"; // para usar response y request
import jwt, { type JwtPayload } from "jsonwebtoken";

// funcion para iniciar sesion
export const login = async (req: Request, res: Response) => {
  const { email, contrasena } = req.body; // obtener el contenido del formdata( input )

  // verificamos si existe un usuario con esos datos
  // solo email para comprobar si existe ese email
  const obtenerUsuario = async (email: string) => {
    // ejecutamos la sentencia sql y la limitamos a solo 1 coincidencia
    const consulta = await conexion.execute({
      sql: "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
      args: [email],
    });

    // almacenamos el resultado
    return consulta.rows[0] as Usuarios; // lo tomamos como tipo usuarios y si no encuentra nada indefnido
  };

  // para obtener todos los datos del usuario
  const usuario = await obtenerUsuario(email);

  if (!usuario) {
    // 401 -> credneciales invalidas
    return res.status(401).json({ error: "Credenciales incorrectas " });
  }

  // si la contraseña es undefined retornamos error
  if (!usuario.contrasena) {
    // 401 -> credneciales invalidas
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // comparamos las contraseñas que ingresa el usuario a la que esta almacenada a la base de datos
  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

  // si no es igual enviar un error
  if (!contrasenaValida) {
    return res.status(401).json({ error: "Contraseña incorrectas" });
  }

  // crear token para enviar los datos de manera segura la usuario
  const token = jwt.sign(
    {
      // dentro del token guardamos el id y email estos de codifican
      id: usuario.id,
      email: usuario.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }, // expira en 24 horas
  );
  // retornar el token
  return res.status(200).json({ token });
};
