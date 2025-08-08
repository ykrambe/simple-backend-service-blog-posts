import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { apiResponses } from "../helper/utils";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json(apiResponses(false, null, "No token provided"));
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json(apiResponses(false, null, "Token format is invalid"));
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(apiResponses(false, null, "Invalid token"));
  }
}