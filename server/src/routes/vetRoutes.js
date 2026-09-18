import { Router } from "express";
import { listVets, getVet, recommendVets, updateAvailability } from "../controllers/vetController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.get("/", listVets);
router.get("/recommend", recommendVets);
router.get("/:id", getVet);
router.put("/availability", protect, authorize("veterinarian"), updateAvailability);

export default router;
