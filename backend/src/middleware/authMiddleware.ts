import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

// JWT secret from env config
const JWT_SECRET = env.JWT_SECRET;

// Extend Express Request type to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; email: string; role: string };
  }
}

/**
 * authMiddleware - main exported middleware for protecting routes
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/**
 * protect - alias for authMiddleware (can use either import { protect } or import { authMiddleware })
 */
export const protect = authMiddleware;
