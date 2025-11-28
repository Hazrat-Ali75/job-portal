import { Request, Response } from "express";
import * as authService from "../services/authService"

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password, role } = req.body;
        const user = await authService.registerUser(name, email, password, role);
        return res.status(201).json({ user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        if (!result) {
            return res.status(401).json({ error: "Invalid credentials" })
        }
        return res.status(200).json({ token: result.token, user: { id: result.user.id, email: result.user.email, role: result.user.role } })
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
}