import { Router } from "express"
import * as applicationController from "../controllers/applicationController"
import { isAuthenticated, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.post("/apply", isAuthenticated, requireRole("CANDIDATE"), applicationController.applyForJob);
router.get("/:id", isAuthenticated, requireRole("CANDIDATE"), applicationController.getApplicationById);

export default router;