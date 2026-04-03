import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../lib/db";

interface tokenDecodedType {
  userId: string;
  exp: number;
}

export const tokenMiddleware = (role?: "ADMIN") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const web = req.cookies.token;
      const app = req.headers.authorization;
      const token = web || app;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as tokenDecodedType;

      if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({ message: "Token expired" });
      }

      const user = await db.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (role !== null && role !== undefined && user.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = user;
      next();
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  };
};
