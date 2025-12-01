import { Router } from "express";
import * as jobController from "../controllers/jobController"

const router = Router();

router.post("/create", jobController.postJob);
router.get("/:id", jobController.getJob);
router.get("/", jobController.listJobs);

export default router;