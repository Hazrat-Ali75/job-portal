import { Router } from "express";
import * as jobController from "../controllers/jobController"
import { isAuthenticated, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", isAuthenticated, requireRole("EMPLOYER"), jobController.postJob);
router.get("/:id", isAuthenticated, jobController.getJob);
router.get("/", jobController.listJobs);

export default router;