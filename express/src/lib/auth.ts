import type { Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function obtenerUsuarioDeToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  try {
    const decodificado = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;
    return { id: decodificado.id, email: decodificado.email };
  } catch {
    return null;
  }
}
