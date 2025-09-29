import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateToken = (payload: any) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
export const verifyToken = (token: string) => jwt.verify(token, env.JWT_SECRET);
