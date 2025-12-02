import { Router } from "express"
import * as applicationController from "../controllers/applicationController"

const router = Router();

router.post("/apply", applicationController.applyForJob);
router.get("/:id", applicationController.getApplicationById);

export default router;