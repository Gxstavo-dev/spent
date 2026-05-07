import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

// Importaciones:
// Request, Response - tipos de Express para manejar solicitudes y respuestas HTTP
// jwt, JwtPayload - para verificar y decodificar tokens JWT

// Controlador que verifica si el token JWT del usuario sigue siendo valido (GET /usuarios/verificar)
// El token se extrae del encabezado de autorizacion de la solicitud
// Retorna: 200 con los datos del usuario si el token es valido, 401 si no hay token o es invalido/expirado
export const verificarToken = async (req: Request, res: Response) => {
  // Obtenemos el encabezado de autorizacion de la solicitud
  const authHeader = req.headers.authorization;

  // Si no hay encabezado de autorizacion, retornamos error
  if (!authHeader) {
    return res.status(401).json({ error: "No tiene token" });
  }

  // Extraemos el token del encabezado (formato: "Bearer <token>")
  const token = authHeader.split(" ")[1];

  try {
    // Verificamos el token usando la clave secreta almacenada en las variables de entorno
    const decodificar = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    // Si el token es valido, retornamos los datos del usuario decodificados
    return res.status(200).json({ valid: true, usuario: decodificar });
  } catch (error) {
    // Si el token es invalido o ha expirado, retornamos error de autenticacion
    return res.status(401).json({ error: "Token invalido o expirado" });
  }
};
