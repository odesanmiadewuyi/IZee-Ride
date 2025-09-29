import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function auth(requiredRole?: "rider" | "driver" | "admin") {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });

    try {
      const token = header.slice(7);
      const payload = jwt.verify(token, env.JWT_SECRET) as any;
      const userId = payload?.sub ?? payload?.id ?? payload?.userId;
      if (!userId) return res.status(401).json({ message: "Invalid token payload" });
      (req as any).user = { id: userId, role: payload?.role ?? "user" };
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
}
