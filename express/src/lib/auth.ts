import type { Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

// Importaciones:
// Request - tipo de Express para la solicitud entrante
// jwt y JwtPayload - para verificar y decodificar tokens JWT

// Extrae y decodifica el usuario autenticado a partir del token JWT
// incluido en el encabezado de autorizacion de la solicitud
// Parametros:
//   req: Request - objeto de solicitud de Express
// Retorna:
//   { id: any, email: any } | null - datos del usuario si el token es valido, null en caso contrario
export function obtenerUsuarioDeToken(req: Request) {
  // Obtenemos el encabezado de autorizacion de la solicitud
  const authHeader = req.headers.authorization;

  // Si no hay encabezado de autorizacion, retornamos null (no autenticado)
  if (!authHeader) return null;

  // El encabezado tiene el formato "Bearer <token>", extraemos solo la parte del token
  const token = authHeader.split(" ")[1];

  try {
    // Verificamos el token usando la clave secreta almacenada en las variables de entorno
    const decodificado = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    // Retornamos el identificador unico y el correo electronico del usuario
    return { id: decodificado.id, email: decodificado.email };
  } catch {
    // Si el token es invalido, ha expirado o hay algun error de verificacion, retornamos null
    return null;
  }
}
