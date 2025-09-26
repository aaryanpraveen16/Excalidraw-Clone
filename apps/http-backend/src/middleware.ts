import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) : void{
  const authHeader = req.headers["authorization"] as string | undefined;
  if (!authHeader) {
    res.status(401).json({ message: "Missing Authorization header" });
    return
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && typeof decoded === "object" && "userId" in decoded) {
      req.userId = (decoded as any).userId;
      next();
      return;
    }

    res.status(403).json({ message: "Unauthorized" });
    return;
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
}