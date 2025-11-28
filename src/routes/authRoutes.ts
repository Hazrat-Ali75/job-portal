import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/sign-up", authController.register);
router.post("/sign-in", authController.login);

export default router;