import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
    user?: { userId: string, role: string }
}

export function isAuthenticated(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET!) as any;
        req.user = { userId: payload.userId, role: payload.role };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export function requireRole(role: string) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    }
}