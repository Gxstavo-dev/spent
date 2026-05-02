import type { Request, Response } from "express"; // para usar response y request
import jwt, { type JwtPayload } from "jsonwebtoken";

// verificar si el token es valido
export const verificarToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No tiene token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodificar = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;
    return res.status(200).json({ valid: true, usuario: decodificar });
  } catch (error) {
    return res.status(401).json({ error: "Token invalido o expirado" });
  }
};
